<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $customers = Customer::query()->orderBy('name')->paginate(10)->through(fn($c) => [
            'id' => $c->id,
            'name' => $c->name,
            'phone' => $c->phone,
            'is_active' => (bool)$c->is_active,
        ]);
        return Inertia::render('customers/index', ['customers' => $customers]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('customers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        Customer::create($request->validated());
        return redirect()->route('customers.index')->with('status', 'Customer created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer): Response
    {
        return Inertia::render('customers/edit', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'address' => $customer->address,
                'email' => $customer->email,
                'tax_id' => $customer->tax_id,
                'opening_balance' => $customer->opening_balance,
                'credit_limit' => $customer->credit_limit,
                'notes' => $customer->notes,
                'is_active' => (bool)$customer->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $customer->update($request->validated());
        return redirect()->route('customers.index')->with('status', 'Customer updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();
        return redirect()->route('customers.index')->with('status', 'Customer deleted');
    }
}
