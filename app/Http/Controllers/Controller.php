<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;

abstract class Controller extends BaseController
{
    use AuthorizesRequests;

    protected function getDashboardMetrics(): array
    {
        $totalPurchases = (float) DB::table('purchase_invoices')->sum('total');
        $totalSales = (float) DB::table('sales_invoices')->sum('total');

        $bestProducts = DB::table('sales_invoice_items')
            ->select('product_id', DB::raw('SUM(qty_base) as qty_sold'))
            ->groupBy('product_id')
            ->orderByDesc('qty_sold')
            ->limit(5)
            ->get();

        $productNames = DB::table('products')->whereIn('id', $bestProducts->pluck('product_id'))->pluck('name', 'id');
        $best = $bestProducts->map(fn($r) => [
            'product' => $productNames[$r->product_id] ?? ('#'.$r->product_id),
            'qty_sold' => (float)$r->qty_sold,
        ]);

        // Low stock alerts: products where stock <= min_stock
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
            'best_products' => $best,
            'low_stock' => $lowStock,
        ];
    }
}
