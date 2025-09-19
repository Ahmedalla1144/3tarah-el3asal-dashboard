<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $warehouses = Warehouse::query()
            ->orderBy('name')
            ->paginate(10)
            ->through(fn($w) => [
                'id' => $w->id,
                'name' => $w->name,
                'code' => $w->code,
                'address' => $w->address,
                'is_active' => (bool)$w->is_active,
            ]);

        return Inertia::render('warehouses/index', [
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('warehouses/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWarehouseRequest $request): RedirectResponse
    {
        Warehouse::create($request->validated());
        return redirect()->route('warehouses.index')->with('status', 'Warehouse created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Warehouse $warehouse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Warehouse $warehouse): Response
    {
        return Inertia::render('warehouses/edit', [
            'warehouse' => [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
                'code' => $warehouse->code,
                'address' => $warehouse->address,
                'is_active' => (bool)$warehouse->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse): RedirectResponse
    {
        $warehouse->update($request->validated());
        return redirect()->route('warehouses.index')->with('status', 'تم تحديث بيانات المخزن بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warehouse $warehouse): RedirectResponse
    {
        try {
            $warehouse->delete();
        } catch (QueryException $e) {
            if ((string) $e->getCode() === '23000') {
                return redirect()->back()->with('error', 'لا يمكن حذف المخزن لوجود معاملات مرتبطة به.');
            }
            return redirect()->back()->with('error', 'تعذر حذف المخزن.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'تعذر حذف المخزن.');
        }
        return redirect()->back()->with('status', 'تم حذف المخزن');
    }
}
