<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $suppliers = Supplier::query()->orderBy('name')->paginate(10)->through(fn($s) => [
            'id' => $s->id,
            'name' => $s->name,
            'phone' => $s->phone,
            'is_active' => (bool)$s->is_active,
        ]);
        return Inertia::render('suppliers/index', ['suppliers' => $suppliers]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('suppliers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request): RedirectResponse
    {
        Supplier::create($request->validated());
        return redirect()->route('suppliers.index')->with('status', 'Supplier created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier): Response
    {
        return Inertia::render('suppliers/edit', [
            'supplier' => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'phone' => $supplier->phone,
                'address' => $supplier->address,
                'email' => $supplier->email,
                'tax_id' => $supplier->tax_id,
                'opening_balance' => $supplier->opening_balance,
                'notes' => $supplier->notes,
                'is_active' => (bool)$supplier->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        try {
            $supplier->update($request->validated());
        } catch (\Illuminate\Database\QueryException $e) {
            if ((string) $e->getCode() === '23000') {
                return redirect()->back()->with('error', 'لا يمكن تعديل المورد بسبب قيود على البيانات (تعارض فريد أو مرجع).');
            }
            return redirect()->back()->with('error', 'تعذر تعديل المورد.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'تعذر تعديل المورد.');
        }
        return redirect()->route('suppliers.index')->with('status', 'تم تعديل المورد');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier): RedirectResponse
    {
        try {
            $supplier->delete();
        } catch (\Illuminate\Database\QueryException $e) {
            if ((string) $e->getCode() === '23000') {
                return redirect()->back()->with('error', 'لا يمكن حذف المورد لوجود معاملات مرتبطة به.');
            }
            return redirect()->back()->with('error', 'تعذر حذف المورد.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'تعذر حذف المورد.');
        }
        return redirect()->route('suppliers.index')->with('status', 'تم حذف المورد');
    }
}
