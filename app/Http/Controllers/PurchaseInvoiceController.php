<?php

namespace App\Http\Controllers;

use App\Models\PurchaseInvoice;
use App\Http\Requests\StorePurchaseInvoiceRequest;
use App\Http\Requests\UpdatePurchaseInvoiceRequest;
use App\Models\Product;
use App\Models\PurchaseInvoiceItem;
use App\Models\StockBalance;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\Warehouse;
use App\Models\ApPayment;
use App\Models\ApAllocation;
use App\Models\ProductUnit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Account;
use App\Models\PaymentMethod;

class PurchaseInvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $invoices = PurchaseInvoice::query()
            ->with(['supplier:id,name'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('number', 'like', "%{$search}%")
                        ->orWhereHas('supplier', fn($qs) => $qs->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(function (PurchaseInvoice $pi) {
                return [
                    'id' => $pi->id,
                    'number' => $pi->number,
                    'supplier' => $pi->supplier?->name,
                    'date' => $pi->date,
                    'status' => $pi->status,
                    'total' => (float)$pi->total,
                    'paid' => (float)$pi->paid_amount,
                    'remaining' => (float)$pi->remaining_amount,
                ];
            });

        return Inertia::render('purchase-invoices/index', [
            'invoices' => $invoices,
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
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name'])->map(fn($s) => ['id' => $s->id, 'name' => $s->name]);
        $warehouses = Warehouse::query()->orderBy('name')->get(['id', 'name'])->map(fn($w) => ['id' => $w->id, 'name' => $w->name]);
        $products = Product::query()->with('units.unit')->orderBy('name')->get(['id', 'name', 'base_unit_id', 'cost_price'])->map(fn($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'base_unit_id' => $p->base_unit_id,
            'cost_price' => $p->cost_price,
            'stock' => $p->stock,
            'units' => $p->units->map(fn($u) => [
                'unit_id' => $u->unit_id,
                'unit' => $u->unit?->name,
                'ratio_to_base' => (float)$u->ratio_to_base,
                'is_default_buy' => (bool)$u->is_default_buy,
            ]),
        ]);
        $units = Unit::query()->orderBy('name')->get(['id', 'name'])->map(fn($u) => ['id' => $u->id, 'name' => $u->name]);
        $nextNumber = (int) (PurchaseInvoice::query()->max('id') ?? 0) + 1;

        return Inertia::render('purchase-invoices/create', [
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
            'products' => $products,
            'units' => $units,
            'next_number' => (string) $nextNumber,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseInvoiceRequest $request): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $invoice = PurchaseInvoice::create([
                'number' => $data['number'],
                'supplier_id' => $data['supplier_id'],
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
            $productsById = Product::query()->whereIn('id', $productIds)->get()->keyBy('id');
            $ratios = ProductUnit::query()
                ->whereIn('product_id', $productIds)
                ->whereIn('unit_id', collect($items)->pluck('unit_id')->map(fn($v) => (int)$v)->unique()->all())
                ->get()
                ->keyBy(fn($r) => $r->product_id . '|' . $r->unit_id);

            foreach ($items as $item) {
                // Determine ratio to base for the selected unit
                $ratio = (float) (ProductUnit::query()
                    ->where('product_id', (int)$item['product_id'])
                    ->where('unit_id', (int)$item['unit_id'])
                    ->value('ratio_to_base') ?? 1.0);

                // If unit_cost not provided, derive from base cost_price
                $product = $productsById->get((int)$item['product_id']);
                $unitCost = isset($item['unit_cost']) && $item['unit_cost'] !== null && $item['unit_cost'] !== ''
                    ? (float)$item['unit_cost']
                    : round(((float)$product->cost_price) * $ratio, 6);

                $lineTotal = round(((float)$item['qty'] * $unitCost) - (float)($item['discount_value'] ?? 0) + (float)($item['tax_value'] ?? 0), 2);

                $piItem = PurchaseInvoiceItem::create([
                    'purchase_invoice_id' => $invoice->id,
                    'product_id' => $item['product_id'],
                    'unit_id' => $item['unit_id'],
                    'qty' => $item['qty'],
                    'unit_cost' => $unitCost,
                    'discount_value' => $item['discount_value'] ?? 0,
                    'tax_value' => $item['tax_value'] ?? 0,
                    'line_total' => $lineTotal,
                    'qty_base' => (float)$item['qty'] * $ratio,
                ]);

                $subtotal += (float)$item['qty'] * $unitCost;
                $discountTotal += (float)($item['discount_value'] ?? 0);
                $taxTotal += (float)($item['tax_value'] ?? 0);
                $grandTotal += $lineTotal;
                $warehouseId = $data['warehouse_id'];
                $qtyBase = (float)$item['qty'] * $ratio;

                // Stock increment in stock_balances
                $balance = StockBalance::firstOrCreate(
                    ['warehouse_id' => $warehouseId, 'product_id' => $item['product_id']],
                    ['qty_base' => 0]
                );

                // Increment the stock
                $balance->increment('qty_base', $qtyBase);

                // Get the updated quantity
                $balance->refresh();
                $newQtyBase = $balance->qty_base;

                // Update product prices for this specific product
                $product = Product::find($item['product_id']);
                if ($product) {
                    // Normalize entered unit_cost to base unit price
                    $baseUnitCost = (float)$item['unit_cost'] / max(1e-9, $ratio);
                    $product->update([
                        'cost_price' => round($baseUnitCost, 6),
                        'sale_price' => round($baseUnitCost * 1.2, 6),
                    ]);
                }

                // Inventory movement IN
                DB::table('inventory_movements')->insert([
                    'warehouse_id' => $data['warehouse_id'],
                    'product_id' => $item['product_id'],
                    'direction' => 'in',
                    'qty_base' => $qtyBase,
                    'unit_cost' => $item['unit_cost'],
                    'reason' => 'purchase',
                    'purchase_invoice_item_id' => $piItem->id,
                    'note' => 'Purchase invoice #' . $invoice->number,
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

            // Optional upfront payment (AP)
            if (!empty($data['paid_amount']) && (float)$data['paid_amount'] > 0) {
                if ((float)$data['paid_amount'] > (float)$grandTotal) {
                    throw ValidationException::withMessages([
                        'paid_amount' => 'لا يمكن أن يكون المبلغ المدفوع أكبر من قيمة الفاتورة',
                    ]);
                }
                $amount = (float)$data['paid_amount'];
                $nextNumber = (int) (ApPayment::query()->max('id') ?? 0) + 1;
                $payment = ApPayment::create([
                    'number' => (string)$nextNumber,
                    'supplier_id' => $invoice->supplier_id,
                    'account_id' => 1,
                    'payment_method_id' => 1,
                    'amount' => $amount,
                    'paid_at' => now(),
                    'reference_no' => null,
                    'notes' => 'Upfront on create',
                    'user_id' => Auth::user()->id,
                ]);

                ApAllocation::create([
                    'ap_payment_id' => $payment->id,
                    'purchase_invoice_id' => $invoice->id,
                    'amount' => $amount,
                ]);

                $invoice->refresh();
                if ($invoice->remaining_amount <= 0.0) {
                    $invoice->update(['status' => 'paid']);
                }
            }
        });

        return redirect()->route('purchase-invoices.index')->with('status', 'Purchase invoice created');
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseInvoice $purchaseInvoice)
    {
        $purchaseInvoice->load(['supplier:id,name', 'warehouse:id,name', 'items.product:id,name,sku']);

        return Inertia::render('purchase-invoices/show', [
            'invoice' => [
                'id' => $purchaseInvoice->id,
                'number' => $purchaseInvoice->number,
                'supplier' => $purchaseInvoice->supplier?->name,
                'warehouse' => $purchaseInvoice->warehouse?->name,
                'date' => $purchaseInvoice->date,
                'status' => $purchaseInvoice->status,
                'subtotal' => $purchaseInvoice->subtotal,
                'discount_total' => $purchaseInvoice->discount_total,
                'tax_total' => $purchaseInvoice->tax_total,
                'total' => $purchaseInvoice->total,
                'paid' => $purchaseInvoice->paid_amount,
                'remaining' => $purchaseInvoice->remaining_amount,
                'notes' => $purchaseInvoice->notes,
                'items' => $purchaseInvoice->items->map(function ($it) {
                    return [
                        'id' => $it->id,
                        'product' => $it->product?->name,
                        'sku' => $it->product?->sku,
                        'qty' => (float)$it->qty,
                        'unit_cost' => (float)$it->unit_cost,
                        'discount_value' => (float)$it->discount_value,
                        'tax_value' => (float)$it->tax_value,
                        'line_total' => (float)$it->line_total,
                    ];
                }),
            ],
        ]);
    }

    public function print(PurchaseInvoice $purchaseInvoice)
    {
        $purchaseInvoice->load([
            'supplier',
            'warehouse',
            'items.product',
            'items.unit'
        ]);

        return view('purchase-invoices.print', ['invoice' => $purchaseInvoice]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseInvoice $purchaseInvoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseInvoiceRequest $request, PurchaseInvoice $purchaseInvoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseInvoice $purchaseInvoice)
    {
        //
    }

    /**
     * Show add payment form for a purchase invoice
     */
    public function payForm(PurchaseInvoice $purchaseInvoice): Response
    {
        $accounts = Account::query()->orderBy('name')->get(['id', 'name'])->map(fn($a) => ['id' => $a->id, 'name' => $a->name]);
        $methods = PaymentMethod::query()->orderBy('name')->get(['id', 'name'])->map(fn($m) => ['id' => $m->id, 'name' => $m->name]);

        return Inertia::render('purchase-invoices/pay', [
            'invoice' => [
                'id' => $purchaseInvoice->id,
                'number' => $purchaseInvoice->number,
                'supplier' => $purchaseInvoice->supplier?->name,
                'total' => (float)$purchaseInvoice->total,
                'paid' => (float)$purchaseInvoice->paid_amount,
                'remaining' => (float)$purchaseInvoice->remaining_amount,
            ],
            'accounts' => $accounts,
            'methods' => $methods,
        ]);
    }

    /**
     * Add supplier payment against an existing purchase invoice
     */
    public function pay(Request $request, PurchaseInvoice $purchaseInvoice): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01', function ($attr, $value, $fail) use ($purchaseInvoice) {
                if ((float)$value > (float)$purchaseInvoice->remaining_amount) {
                    $fail('لا يمكن أن يكون المبلغ المدفوع أكبر من المتبقي للفاتورة');
                }
            }],
            'payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
            'reference_no' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($validated, $purchaseInvoice) {
            $nextNumber = (int) (ApPayment::query()->max('id') ?? 0) + 1;
            $payment = ApPayment::create([
                'number' => (string)$nextNumber,
                'supplier_id' => $purchaseInvoice->supplier_id,
                'account_id' => $validated['account_id'],
                'payment_method_id' => $validated['payment_method_id'],
                'amount' => (float)$validated['amount'],
                'paid_at' => now(),
                'reference_no' => $validated['reference_no'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'user_id' => Auth::user()->id,
            ]);

            ApAllocation::create([
                'ap_payment_id' => $payment->id,
                'purchase_invoice_id' => $purchaseInvoice->id,
                'amount' => (float)$validated['amount'],
            ]);

            // Update status if fully paid
            $purchaseInvoice->refresh();
            if ($purchaseInvoice->remaining_amount <= 0.0) {
                $purchaseInvoice->update(['status' => 'paid']);
            }
        });

        return redirect()->route('purchase-invoices.index')->with('status', 'Supplier payment recorded');
    }
}
