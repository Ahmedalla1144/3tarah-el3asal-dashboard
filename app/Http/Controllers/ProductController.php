<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $product->update($request->validated());

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
