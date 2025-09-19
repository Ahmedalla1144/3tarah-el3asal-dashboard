<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use App\Models\ProductUnit;
use App\Models\StockBalance;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);

        $search = $request->string('search')->toString();
        $warehouseId = $request->integer('warehouse_id');

        $products = Product::query()
            ->with(['baseUnit:id,name'])
            ->withCurrentStock($warehouseId)
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(function (Product $product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'stock' => $product->stock,
                    'base_unit' => [
                        'id' => $product->base_unit_id,
                        'name' => $product->baseUnit?->name,
                    ],
                    'min_stock' => $product->min_stock,
                    'sale_price' => $product->sale_price,
                    'cost_price' => $product->cost_price,
                    'is_active' => (bool) $product->is_active,
                ];
            });

        return Inertia::render('products/index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Product::class);

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn($c) => ['id' => $c->id, 'name' => $c->name]);
        $units = Unit::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn($u) => ['id' => $u->id, 'name' => $u->name]);

        return Inertia::render('products/create', [
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->authorize('create', Product::class);

        $data = $request->validated();
        $product = Product::create($data);

        // Automatically create a product unit for the base unit if it exists
        if ($product->base_unit_id) {
            ProductUnit::create([
                'product_id' => $product->id,
                'unit_id' => $product->base_unit_id,
                'ratio_to_base' => 1.0,
                'is_default_sale' => true, // Make base unit default for sales
                'is_default_buy' => true,  // Make base unit default for purchases
            ]);
        }

        return redirect()
            ->route('products.index')
            ->with('status', 'Product created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): RedirectResponse
    {
        // Not used; redirect to edit for simplicity
        return redirect()->route('products.edit', $product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn($c) => ['id' => $c->id, 'name' => $c->name]);
        $units = Unit::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn($u) => ['id' => $u->id, 'name' => $u->name]);

        $product->load(['units.unit']);

        return Inertia::render('products/edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'barcode' => $product->barcode,
                'category_id' => $product->category_id,
                'base_unit_id' => $product->base_unit_id,
                'sale_price' => $product->sale_price,
                'cost_price' => $product->cost_price,
                'min_stock' => $product->min_stock,
                'is_batch_tracked' => (bool) $product->is_batch_tracked,
                'is_active' => (bool) $product->is_active,
            ],
            'categories' => $categories,
            'units' => $units,
            'product_units' => $product->units->map(fn($pu) => [
                'unit_id' => $pu->unit_id,
                'unit_name' => $pu->unit?->name,
                'ratio_to_base' => (float) $pu->ratio_to_base,
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $data = $request->validated();

        // Handle base unit change: rebase ratios and stock to keep physical quantities consistent
        $newBaseUnitId = $data['base_unit_id'] ?? $product->base_unit_id;
        $oldBaseUnitId = $product->base_unit_id;

        if ($newBaseUnitId && $oldBaseUnitId && (int) $newBaseUnitId !== (int) $oldBaseUnitId) {
            // Find existing ratio of the intended new base unit relative to the old base
            $newBasePivot = ProductUnit::query()
                ->where('product_id', $product->id)
                ->where('unit_id', $newBaseUnitId)
                ->first();

            if ($newBasePivot) {
                $rebasingFactor = (float) max($newBasePivot->ratio_to_base, 1e-9); // old-base per 1 new-base

                DB::transaction(function () use ($product, $data, $newBaseUnitId, $rebasingFactor, $newBasePivot) {
                    // Update product including min_stock scaled to new base
                    $newMinStock = $product->min_stock !== null
                        ? round(((float) $product->min_stock) / $rebasingFactor, 6)
                        : null;

                    $newSalePrice = $product->sale_price !== null
                        ? round(((float) $product->sale_price) * $rebasingFactor, 6)
                        : null;
                    $newCostPrice = $product->cost_price !== null
                        ? round(((float) $product->cost_price) * $rebasingFactor, 6)
                        : null;

                    $product->update(array_merge($data, [
                        'min_stock' => $newMinStock,
                        'base_unit_id' => $newBaseUnitId,
                        'sale_price' => $newSalePrice,
                        'cost_price' => $newCostPrice,
                    ]));

                    // Rebase all product unit ratios: divide by factor so they become relative to new base
                    ProductUnit::query()
                        ->where('product_id', $product->id)
                        ->update([
                            'ratio_to_base' => DB::raw('ratio_to_base / ' . $rebasingFactor),
                        ]);

                    // Ensure the selected new base unit has ratio 1 exactly
                    $newBasePivot->refresh();
                    $newBasePivot->update(['ratio_to_base' => 1.0]);

                    // Rebase current stock balances to the new base unit
                    StockBalance::query()
                        ->where('product_id', $product->id)
                        ->update([
                            'qty_base' => DB::raw('qty_base / ' . $rebasingFactor),
                        ]);

                    // Rebase historical line items to keep analytics correct
                    DB::table('sales_invoice_items')
                        ->where('product_id', $product->id)
                        ->update([
                            'qty_base' => DB::raw('qty_base / ' . $rebasingFactor),
                        ]);

                    DB::table('purchase_invoice_items')
                        ->where('product_id', $product->id)
                        ->update([
                            'qty_base' => DB::raw('qty_base / ' . $rebasingFactor),
                        ]);

                    DB::table('inventory_movements')
                        ->where('product_id', $product->id)
                        ->update([
                            'qty_base' => DB::raw('qty_base / ' . $rebasingFactor),
                        ]);
                });
            } else {
                // If no mapping exists for the chosen unit, create one as base (ratio 1) and proceed with a simple update
                DB::transaction(function () use ($product, $data, $newBaseUnitId) {
                    ProductUnit::firstOrCreate([
                        'product_id' => $product->id,
                        'unit_id' => $newBaseUnitId,
                    ], [
                        'ratio_to_base' => 1.0,
                        'is_default_sale' => false,
                        'is_default_buy' => false,
                    ]);

                    $product->update($data);
                });
            }
        } else {
            $product->update($data);
        }

        return redirect()
            ->route('products.index')
            ->with('status', 'Product updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('status', 'Product deleted');
    }
}
