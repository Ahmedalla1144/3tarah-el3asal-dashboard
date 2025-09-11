<?php

namespace App\Http\Controllers;

use App\Models\SalesInvoice;
use App\Http\Requests\StoreSalesInvoiceRequest;
use App\Http\Requests\UpdateSalesInvoiceRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\SalesInvoiceItem;
use App\Models\ProductUnit;
use App\Models\ArReceipt;
use App\Models\ArAllocation;
use App\Models\StockBalance;
use App\Models\Unit;
use App\Models\Warehouse;
use App\Models\Account;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;


class SalesInvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $invoices = SalesInvoice::query()
            ->with(['customer:id,name'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('number', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn($qs) => $qs->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(function (SalesInvoice $si) {
                return [
                    'id' => $si->id,
                    'number' => $si->number,
                    'customer' => $si->customer?->name,
                    'date' => $si->date,
                    'status' => $si->status,
                    'total' => (float)$si->total,
                    'paid' => (float)$si->paid_amount,
                    'remaining' => (float)$si->remaining_amount,
                ];
            });

        return Inertia::render('sales-invoices/index', [
            'invoices' => $invoices,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $customers = Customer::query()->orderBy('name')->get(['id', 'name'])->map(fn($c) => ['id' => $c->id, 'name' => $c->name]);
        $warehouses = Warehouse::query()->orderBy('name')->get(['id', 'name'])->map(fn($w) => ['id' => $w->id, 'name' => $w->name]);
        $products = Product::query()->with('units.unit')->orderBy('name')->get(['id', 'name', 'base_unit_id', 'sale_price'])->map(fn($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'base_unit_id' => $p->base_unit_id,
            'sale_price' => $p->sale_price,
            'stock' => $p->stock,
            'units' => $p->units->map(fn($u) => [
                'unit_id' => $u->unit_id,
                'unit' => $u->unit?->name,
                'ratio_to_base' => (float)$u->ratio_to_base,
                'is_default_sale' => (bool)$u->is_default_sale,
            ]),
        ]);
        $units = Unit::query()->orderBy('name')->get(['id', 'name'])->map(fn($u) => ['id' => $u->id, 'name' => $u->name]);
        $nextNumber = (int) (SalesInvoice::query()->max('id') ?? 0) + 1;

        return Inertia::render('sales-invoices/create', [
            'customers' => $customers,
            'warehouses' => $warehouses,
            'products' => $products,
            'units' => $units,
            'next_number' => (string) $nextNumber,
        ]);
    }

    public function store(StoreSalesInvoiceRequest $request): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $invoice = SalesInvoice::create([
                'number' => $data['number'],
                'customer_id' => $data['customer_id'],
                'warehouse_id' => $data['warehouse_id'],
                'date' => $data['date'],
                'due_date' => $data['due_date'] ?? null,
                'status' => 'open',
                'subtotal' => 0,
                'discount_total' => 0,
                'tax_total' => 0,
                'total' => 0,
                'notes' => $data['notes'] ?? null,
                'user_id' => Auth::user()->id,
            ]);

            $subtotal = 0;
            $discountTotal = 0;
            $taxTotal = 0;
            $grandTotal = 0;

            $items = array_values(array_filter($data['items'], function ($it) {
                return !empty($it['product_id'])
                    && (float)($it['qty'] ?? 0) > 0;
            }));

            // Prefetch products and unit ratios to avoid N+1 queries
            $productIds = collect($items)->pluck('product_id')->map(fn($v) => (int)$v)->unique()->all();
            $unitPairs = collect($items)->map(fn($it) => [(int)$it['product_id'], (int)$it['unit_id']])->all();
            $productsById = Product::query()->whereIn('id', $productIds)->get()->keyBy('id');
            $ratios = ProductUnit::query()
                ->whereIn('product_id', $productIds)
                ->whereIn('unit_id', collect($items)->pluck('unit_id')->map(fn($v)=>(int)$v)->unique()->all())
                ->get()
                ->keyBy(fn($r) => $r->product_id . '|' . $r->unit_id);

            foreach ($items as $item) {
                // Check stock availability
                $product = $productsById->get((int)$item['product_id']);
                if (!$product || $product->stock <= 0) {
                    throw new \Exception("المنتج {$product->name} غير متوفر في المخزون");
                }

                if ($product->stock < $item['qty']) {
                    throw new \Exception("الكمية المطلوبة للمنتج {$product->name} تتجاوز المخزون المتاح ({$product->stock})");
                }

                // Determine ratio to base for the selected unit
                $ratio = (float) ($ratios->get(((int)$item['product_id']) . '|' . ((int)$item['unit_id']))->ratio_to_base ?? 1.0);

                // If unit_price not provided, derive from base sale_price
                $unitPrice = isset($item['unit_price']) && $item['unit_price'] !== null && $item['unit_price'] !== ''
                    ? (float)$item['unit_price']
                    : round(((float)$product->sale_price) * $ratio, 6);

                $lineTotal = round(($item['qty'] * $unitPrice) - (float)($item['discount_value'] ?? 0) + (float)($item['tax_value'] ?? 0), 2);

                $siItem = SalesInvoiceItem::create([
                    'sales_invoice_id' => $invoice->id,
                    'product_id' => $item['product_id'],
                    'unit_id' => $item['unit_id'],
                    'qty' => $item['qty'],
                    'unit_price' => $unitPrice,
                    'discount_value' => $item['discount_value'] ?? 0,
                    'tax_value' => $item['tax_value'] ?? 0,
                    'line_total' => $lineTotal,
                    'qty_base' => (float)$item['qty'] * $ratio,
                ]);

                $subtotal += (float)$item['qty'] * $unitPrice;
                $discountTotal += (float)($item['discount_value'] ?? 0);
                $taxTotal += (float)($item['tax_value'] ?? 0);
                $grandTotal += $lineTotal;
                $qtyBase = (float)$item['qty'] * $ratio;
                $warehouseId = $data['warehouse_id'];

                // Stock decrement
                $balance = StockBalance::firstOrCreate(
                    ['warehouse_id' => $warehouseId, 'product_id' => (int)$item['product_id']],
                    ['qty_base' => 0]
                );
                $balance->decrement('qty_base', $qtyBase);

                // Inventory movement OUT
                DB::table('inventory_movements')->insert([
                    'warehouse_id' => $data['warehouse_id'],
                    'product_id' => $item['product_id'],
                    'direction' => 'out',
                    'qty_base' => $qtyBase,
                    'unit_cost' => null,
                    'reason' => 'sale',
                    'sales_invoice_item_id' => $siItem->id,
                    'note' => 'Sales invoice #' . $invoice->number,
                    'moved_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $invoice->update([
                'subtotal' => round($subtotal, 2),
                'discount_total' => round($discountTotal, 2),
                'tax_total' => round($taxTotal, 2),
                'total' => round($grandTotal, 2),
            ]);

            // Optional upfront payment
            if (!empty($data['paid_amount']) && (float)$data['paid_amount'] > 0) {
                $amount = min((float)$data['paid_amount'], (float)$invoice->total);
                $nextNumber = (int) (ArReceipt::query()->max('id') ?? 0) + 1;
                $receipt = ArReceipt::create([
                    'number' => (string)$nextNumber,
                    'customer_id' => $invoice->customer_id,
                    'account_id' => 1,
                    'payment_method_id' => 1,
                    'amount' => $amount,
                    'received_at' => now(),
                    'reference_no' => null,
                    'notes' => 'Upfront on create',
                    'user_id' => Auth::user()->id,
                ]);

                ArAllocation::create([
                    'ar_receipt_id' => $receipt->id,
                    'sales_invoice_id' => $invoice->id,
                    'amount' => $amount,
                ]);

                $invoice->refresh();
                if ($invoice->remaining_amount <= 0.0) {
                    $invoice->update(['status' => 'paid']);
                }
            }
        });

        return redirect()->route('sales-invoices.index')->with('status', 'Sales invoice created');
    }

    /**
     * Show add payment form for a sales invoice
     */
    public function payForm(SalesInvoice $salesInvoice): Response
    {
        $accounts = Account::query()->orderBy('name')->get(['id', 'name'])->map(fn($a) => ['id' => $a->id, 'name' => $a->name]);
        $methods = PaymentMethod::query()->orderBy('name')->get(['id', 'name'])->map(fn($m) => ['id' => $m->id, 'name' => $m->name]);

        return Inertia::render('sales-invoices/pay', [
            'invoice' => [
                'id' => $salesInvoice->id,
                'number' => $salesInvoice->number,
                'customer' => $salesInvoice->customer?->name,
                'total' => (float)$salesInvoice->total,
                'paid' => (float)$salesInvoice->paid_amount,
                'remaining' => (float)$salesInvoice->remaining_amount,
            ],
            'accounts' => $accounts,
            'methods' => $methods,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesInvoice $salesInvoice)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SalesInvoice $salesInvoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSalesInvoiceRequest $request, SalesInvoice $salesInvoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SalesInvoice $salesInvoice)
    {
        //
    }

    /**
     * Add payment (receipt) against an existing sales invoice
     */
    public function pay(Request $request, SalesInvoice $salesInvoice): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method_id' => ['nullable', 'integer'],
            'account_id' => ['nullable', 'integer'],
            'reference_no' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($validated, $salesInvoice) {
            $nextNumber = (int) (ArReceipt::query()->max('id') ?? 0) + 1;
            $receipt = ArReceipt::create([
                'number' => (string)$nextNumber,
                'customer_id' => $salesInvoice->customer_id,
                'account_id' => $validated['account_id'] ?? null,
                'payment_method_id' => $validated['payment_method_id'] ?? null,
                'amount' => (float)$validated['amount'],
                'received_at' => now(),
                'reference_no' => $validated['reference_no'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'user_id' => Auth::user()->id,
            ]);

            ArAllocation::create([
                'ar_receipt_id' => $receipt->id,
                'sales_invoice_id' => $salesInvoice->id,
                'amount' => (float)$validated['amount'],
            ]);

            // Update status if fully paid
            $salesInvoice->refresh();
            if ($salesInvoice->remaining_amount <= 0.0) {
                $salesInvoice->update(['status' => 'paid']);
            }
        });

        return redirect()->route('sales-invoices.index')->with('status', 'Payment recorded');
    }
}
