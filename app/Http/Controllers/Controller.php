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

        // جلب أفضل المنتجات حسب الكمية في الوحدة الأساسية
        $bestProductsRaw = DB::table('sales_invoice_items as sii')
    ->join('sales_invoices as si', 'si.id', '=', 'sii.sales_invoice_id')
    ->join('products as p', 'p.id', '=', 'sii.product_id')
    ->leftJoin('product_units as pu', function($join) {
        $join->on('pu.product_id', '=', 'sii.product_id')
        ->on('pu.unit_id', '=', 'sii.unit_id');
    })
    ->whereBetween('si.date', [$startOfMonth, $endOfMonth])
    ->select('sii.product_id', 'sii.qty_base', DB::raw('COALESCE(pu.ratio_to_base,1) as ratio'))
    ->get();

        $productIds = $bestProductsRaw->pluck('product_id');
        $qtyByProduct = [];
        // dd($bestProductsRaw);
foreach ($bestProductsRaw as $item) {
    $qtyByProduct[$item->product_id] = ($qtyByProduct[$item->product_id] ?? 0) + ($item->qty_base * $item->ratio);
}

arsort($qtyByProduct);
$topProducts = array_slice($qtyByProduct, 0, 5, true);

        // أسماء المنتجات
        $productNames = DB::table('products')->whereIn('id', array_keys($topProducts))->pluck('name', 'id');

        // الوحدة الأساسية لكل منتج
        $baseUnits = DB::table('products')->whereIn('id', array_keys($topProducts))->pluck('base_unit_id', 'id');


        $units = DB::table('units')->whereIn('id', $baseUnits->values())->pluck('name', 'id');


        $bestProducts = [];
        foreach ($topProducts as $productId => $qty) {
            $bestProducts[] = [
                'product' => $productNames[$productId] ?? ('#'.$productId),
                'qty_sold' => (float)$qty,
                'product_unit' => $units[$baseUnits[$productId]] ?? null,
            ];
        }

        // Low stock alerts: المنتجات حيث المخزون <= الحد الأدنى
        $lowStock = DB::table('products as p')
            ->leftJoin('stock_balances as sb', 'sb.product_id', '=', 'p.id')
            ->select('p.id', 'p.name', 'p.min_stock', DB::raw('COALESCE(SUM(sb.qty_base),0) as stock'))
            ->whereNotNull('p.min_stock')
            ->groupBy('p.id', 'p.name', 'p.min_stock')
            ->havingRaw('COALESCE(SUM(sb.qty_base),0) <= p.min_stock')
            ->orderBy(DB::raw('COALESCE(SUM(sb.qty_base),0)'))
            ->limit(10)
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'stock' => (float)$r->stock,
                'min_stock' => (float)$r->min_stock,
            ]);

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
