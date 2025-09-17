<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Http\Requests\StoreUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $units = Unit::query()->orderBy('name')->paginate(10)->withQueryString()->through(fn(Unit $u) => [
            'id' => $u->id,
            'name' => $u->name,
        ]);
        return Inertia::render('units/index', [
            'units' => $units,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('units/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUnitRequest $request): RedirectResponse
    {
        $data = $request->validated();
        Unit::create($data);
        return redirect()->route('units.index')->with('status', 'تم إنشاء الوحدة');
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit): Response
    {
        return Inertia::render('units/edit', [
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUnitRequest $request, Unit $unit): RedirectResponse
    {
        $data = $request->validated();
        $unit->update($data);
        return redirect()->route('units.index')->with('status', 'تم تحديث الوحدة');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit): RedirectResponse
    {
        if ($unit->productUnits()->exists()) {
            return redirect()->route('units.index')->with('error', 'لا يمكن حذف الوحدة لأنها مستخدمة في المنتجات');
        }

        $unit->delete();
        return redirect()->route('units.index')->with('status', 'تم حذف الوحدة');
    }
}
