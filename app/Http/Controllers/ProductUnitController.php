<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductUnit;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductUnitController extends Controller
{
    /**
     * Show the form for managing product units
     */
    public function index(Product $product): Response
    {
        $product->load(['units.unit', 'baseUnit']);
        
        $units = Unit::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('products/units', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'base_unit' => [
                    'id' => $product->base_unit_id,
                    'name' => $product->baseUnit?->name,
                ],
                'units' => $product->units->map(fn($pu) => [
                    'id' => $pu->id,
                    'unit_id' => $pu->unit_id,
                    'unit_name' => $pu->unit?->name,
                    'ratio_to_base' => (float)$pu->ratio_to_base,
                    'is_default_sale' => (bool)$pu->is_default_sale,
                    'is_default_buy' => (bool)$pu->is_default_buy,
                ]),
            ],
            'availableUnits' => $units->map(fn($u) => ['id' => $u->id, 'name' => $u->name]),
        ]);
    }

    /**
     * Store a newly created product unit
     */
    public function store(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'unit_id' => ['required', 'integer', 'exists:units,id'],
            'ratio_to_base' => ['required', 'numeric', 'min:0.000001'],
            'is_default_sale' => ['sometimes', 'boolean'],
            'is_default_buy' => ['sometimes', 'boolean'],
        ]);

        // Check if this unit already exists for this product
        if ($product->units()->where('unit_id', $validated['unit_id'])->exists()) {
            return redirect()->back()->withErrors(['unit_id' => 'هذه الوحدة موجودة بالفعل للمنتج']);
        }

        // If setting as default, unset other defaults
        if ($validated['is_default_sale'] ?? false) {
            $product->units()->update(['is_default_sale' => false]);
        }
        if ($validated['is_default_buy'] ?? false) {
            $product->units()->update(['is_default_buy' => false]);
        }

        $product->units()->create($validated);

        return redirect()->back()->with('status', 'تم إضافة الوحدة بنجاح');
    }

    /**
     * Update the specified product unit
     */
    public function update(Request $request, Product $product, ProductUnit $productUnit): RedirectResponse
    {
        $validated = $request->validate([
            'ratio_to_base' => ['required', 'numeric', 'min:0.000001'],
            'is_default_sale' => ['sometimes', 'boolean'],
            'is_default_buy' => ['sometimes', 'boolean'],
        ]);

        // If setting as default, unset other defaults
        if ($validated['is_default_sale'] ?? false) {
            $product->units()->where('id', '!=', $productUnit->id)->update(['is_default_sale' => false]);
        }
        if ($validated['is_default_buy'] ?? false) {
            $product->units()->where('id', '!=', $productUnit->id)->update(['is_default_buy' => false]);
        }

        $productUnit->update($validated);

        return redirect()->back()->with('status', 'تم تحديث الوحدة بنجاح');
    }

    /**
     * Remove the specified product unit
     */
    public function destroy(Product $product, ProductUnit $productUnit): RedirectResponse
    {
        // Don't allow deleting the base unit
        if ($productUnit->unit_id === $product->base_unit_id) {
            return redirect()->back()->withErrors(['unit' => 'لا يمكن حذف الوحدة الأساسية']);
        }

        $productUnit->delete();

        return redirect()->back()->with('status', 'تم حذف الوحدة بنجاح');
    }
}