<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\ArReceipt;
use App\Models\ArAllocation;
use App\Models\SalesInvoice;
use App\Models\Account;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerPaymentController extends Controller
{
    /**
     * Show the payment form for a customer
     */
    public function create(Customer $customer): Response
    {
        $customer->load(['salesInvoices' => function($q) {
            $q->where('status', 'open')->orderBy('date');
        }]);
        
        $accounts = Account::where('is_active', true)->get(['id', 'name']);
        $paymentMethods = PaymentMethod::where('is_active', true)->get(['id', 'name']);
        
        
        return Inertia::render('customers/payment', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'current_balance' => $customer->current_balance,
                'unpaid_invoices' => $customer->salesInvoices->map(fn($invoice) => [
                    'id' => $invoice->id,
                    'number' => $invoice->number,
                    'total' => $invoice->total,
                    'paid' => $invoice->paid_amount,
                    'remaining' => $invoice->remaining_amount,
                    'date' => $invoice->date,
                ]),
            ],
            'accounts' => $accounts,
            'paymentMethods' => $paymentMethods,
        ]);
    }
    
    /**
     * Process customer payment
     */
    public function store(Request $request, Customer $customer): RedirectResponse
    {
        // تشخيص البيانات المرسلة
        \Log::info('Payment request data:', [
            'customer_id' => $customer->id,
            'request_data' => $request->all(),
            'customer_balance' => $customer->current_balance
        ]);
        
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'account_id' => 'required|exists:accounts,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'received_at' => 'required|date',
            'reference_no' => 'nullable|string|max:60',
            'notes' => 'nullable|string',
        ]);
        
        // التحقق من أن المبلغ لا يتجاوز الرصيد المدين
        if ($request->amount > $customer->current_balance) {
            return back()->withErrors(['amount' => 'المبلغ المدخل أكبر من الرصيد المدين للعميل']);
        }
        
        // إنشاء التخصيمات التلقائية إذا لم يتم إرسالها
        $allocations = $request->allocations ?? [];
        \Log::info('Allocations before processing:', $allocations);
        
        if (empty($allocations)) {
            // تخصيم تلقائي على الفواتير حسب التاريخ
            $remainingAmount = $request->amount;
            $unpaidInvoices = $customer->salesInvoices()
                ->where('status', 'open')
                ->orderBy('date')
                ->get();
            
            \Log::info('Unpaid invoices found:', $unpaidInvoices->toArray());
            
            foreach ($unpaidInvoices as $invoice) {
                if ($remainingAmount <= 0) break;
                
                $allocationAmount = min($remainingAmount, $invoice->remaining_amount);
                if ($allocationAmount > 0) {
                    $allocations[] = [
                        'invoice_id' => $invoice->id,
                        'amount' => $allocationAmount
                    ];
                    $remainingAmount -= $allocationAmount;
                }
            }
            
            \Log::info('Auto-generated allocations:', $allocations);
        }
        
        // التحقق من أن مجموع التخصيمات يساوي المبلغ المدفوع
        $totalAllocations = collect($allocations)->sum('amount');
        if (abs($totalAllocations - $request->amount) > 0.01) {
            return back()->withErrors(['amount' => 'لا يمكن تخصيم المبلغ على الفواتير المتاحة']);
        }
        
        // التحقق من وجود فواتير غير مدفوعة
        if (empty($allocations)) {
            return back()->withErrors(['amount' => 'لا توجد فواتير غير مدفوعة لتخصيم المبلغ عليها']);
        }
        
        DB::beginTransaction();
        
        try {
            // إنشاء إيصال الدفع
            $receipt = ArReceipt::create([
                'number' => $this->generateReceiptNumber(),
                'customer_id' => $customer->id,
                'account_id' => $request->account_id,
                'payment_method_id' => $request->payment_method_id,
                'amount' => $request->amount,
                'received_at' => $request->received_at,
                'reference_no' => $request->reference_no,
                'notes' => $request->notes,
                'user_id' => auth()->id(),
            ]);
            
            // إنشاء التخصيمات
            foreach ($allocations as $allocation) {
                $invoice = SalesInvoice::find($allocation['invoice_id']);
                
                // التحقق من أن المبلغ لا يتجاوز المتبقي من الفاتورة
                if ($allocation['amount'] > $invoice->remaining_amount) {
                    throw new \Exception("المبلغ المخصص للفاتورة #{$invoice->number} أكبر من المتبقي منها");
                }
                
                ArAllocation::create([
                    'ar_receipt_id' => $receipt->id,
                    'sales_invoice_id' => $invoice->id,
                    'amount' => $allocation['amount'],
                ]);
                
                // تحديث حالة الفاتورة إذا تم دفعها بالكامل
                $invoice->refresh();
                if ($invoice->remaining_amount <= 0.01) {
                    $invoice->update(['status' => 'paid']);
                }
            }
            
            DB::commit();
            
            return redirect()->route('customers.index')->with('success', 'تم تسجيل الدفع بنجاح');
            
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Payment processing error: ' . $e->getMessage(), [
                'customer_id' => $customer->id,
                'amount' => $request->amount,
                'allocations' => $allocations
            ]);
            return back()->withErrors(['error' => 'حدث خطأ أثناء معالجة الدفع: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Generate unique receipt number
     */
    private function generateReceiptNumber(): string
    {
        do {
            $number = 'RCP-' . strtoupper(Str::random(8));
        } while (ArReceipt::where('number', $number)->exists());
        
        return $number;
    }
}
