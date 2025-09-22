<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

abstract class Controller extends BaseController
{
    use AuthorizesRequests;

    protected function getDashboardMetrics(): array
    {
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $totalPurchases = (float) DB::table('purchase_invoices')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('total');

        $totalSales = (float) DB::table('sales_invoices')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('total');

        // أفضل المنتجات: جمع الكمية بوحدة الأساس (qty_base) مباشرة
        $bestProductsAgg = DB::table('sales_invoice_items as sii')
            ->join('sales_invoices as si', 'si.id', '=', 'sii.sales_invoice_id')
            ->whereBetween('si.date', [$startOfMonth, $endOfMonth])
            ->select('sii.product_id', DB::raw('SUM(sii.qty_base) as qty_base_sum'))
            ->groupBy('sii.product_id')
            ->orderByDesc(DB::raw('SUM(sii.qty_base)'))
            ->limit(5)
            ->get();

        $topProductIds = $bestProductsAgg->pluck('product_id')->all();
        $productNames = DB::table('products')->whereIn('id', $topProductIds)->pluck('name', 'id');
        $baseUnitsMap = DB::table('products')->whereIn('id', $topProductIds)->pluck('base_unit_id', 'id');
        $unitNames = DB::table('units')->whereIn('id', $baseUnitsMap->values())->pluck('name', 'id');

        $bestProducts = $bestProductsAgg->map(function ($row) use ($productNames, $baseUnitsMap, $unitNames) {
            $productId = $row->product_id;
            $baseUnitId = $baseUnitsMap[$productId] ?? null;
            return [
                'product' => $productNames[$productId] ?? ('#' . $productId),
                'qty_sold' => (float) $row->qty_base_sum,
                'product_unit' => $baseUnitId ? ($unitNames[$baseUnitId] ?? null) : null,
            ];
        })->all();

        // subquery: total stock per product
        $stockSums = DB::table('stock_balances')
            ->select('product_id', DB::raw('SUM(qty_base) AS stock'))
            ->groupBy('product_id');

        // main query
        $lowStock = DB::table('products as p')
            ->leftJoinSub($stockSums, 's', fn($j) => $j->on('s.product_id', '=', 'p.id'))
            ->leftJoin('units as u', 'u.id', '=', 'p.base_unit_id')
            ->whereNotNull('p.min_stock')
            ->whereRaw('COALESCE(s.stock, 0) <= p.min_stock')
            ->orderByRaw('COALESCE(s.stock, 0) ASC')
            ->limit(10)
            ->get([
                'p.id',
                'p.name',
                'p.min_stock',
                DB::raw('COALESCE(s.stock, 0) AS stock'),
                'u.name as unit_name',
            ])
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'stock' => (float) $r->stock,
                'min_stock' => (float) $r->min_stock,
                'unit_name' => $r->unit_name,
            ]);


        // Low stock alerts: المنتجات حيث المخزون <= الحد الأدنى
        // $lowStock = DB::table('products as p')
        //     ->leftJoin('stock_balances as sb', 'sb.product_id', '=', 'p.id')
        //     ->leftJoin('units as u', 'u.id', '=', 'p.base_unit_id')
        //     ->select('p.id', 'p.name', 'p.min_stock', 'u.name as unit_name', DB::raw('COALESCE(SUM(sb.qty_base),0) as stock'))
        //     ->whereNotNull('p.min_stock')
        //     ->groupBy('p.id', 'p.name', 'p.min_stock', 'u.name')
        //     ->havingRaw('COALESCE(SUM(sb.qty_base),0) <= p.min_stock')
        //     ->orderBy(DB::raw('COALESCE(SUM(sb.qty_base),0)'))
        //     ->limit(10)
        //     ->get()
        //     ->map(fn($r) => [
        //         'id' => $r->id,
        //         'name' => $r->name,
        //         'stock' => (float) $r->stock,
        //         'min_stock' => (float) $r->min_stock,
        //         'unit_name' => $r->unit_name,
        //     ]);

        return [
            'total_purchases' => $totalPurchases,
            'total_sales' => $totalSales,
            'best_products' => $bestProducts,
            'low_stock' => $lowStock,
            'period' => [
                'start' => $startOfMonth,
                'end' => $endOfMonth,
            ],
        ];
    }
}
