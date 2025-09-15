# إصلاح مشكلة حساب الرصيد المدين في فواتير المبيعات

## المشكلة
كان الرصيد المدين في فواتير المبيعات يتم احتسابه بقيمة الفاتورة نفسها، وهذا خطأ. الرصيد المدين يجب أن يكون الرصيد المدين الحقيقي للعميل وقت إنشاء الفاتورة.

## الحل
تم إضافة حقل جديد في جدول `sales_invoices` لحفظ الرصيد المدين للعميل وقت إنشاء الفاتورة.

## الإصلاحات المطبقة

### 1. إضافة حقل جديد في قاعدة البيانات
```php
// Migration: add_customer_balance_at_invoice_creation_to_sales_invoices_table
$table->decimal('customer_balance_at_creation', 14, 2)->default(0)->after('total');
```

### 2. تحديث نموذج SalesInvoice
```php
// app/Models/SalesInvoice.php
protected $fillable = [
    // ... existing fields
    'customer_balance_at_creation',
    // ... other fields
];
```

### 3. تحديث كود إنشاء الفاتورة
```php
// app/Http/Controllers/SalesInvoiceController.php
// Get customer balance at the time of invoice creation
$customerBalance = 0;
if ($data['customer_id']) {
    $customer = Customer::find($data['customer_id']);
    $customerBalance = $customer ? $customer->current_balance : 0;
}

$invoice = SalesInvoice::create([
    // ... other fields
    'customer_balance_at_creation' => $customerBalance,
    // ... other fields
]);
```

### 4. تحديث صفحة الطباعة
```php
// resources/views/sales-invoices/print.blade.php
// استخدام الرصيد المدين المحفوظ في الفاتورة بدلاً من الرصيد الحالي
@if($invoice->customer && $invoice->customer_balance_at_creation > 0)
<div class="info-row">
    <span class="info-label">الرصيد المدين:</span>
    <span class="info-value debit-balance">{{ number_format($invoice->customer_balance_at_creation, 2) }} جنيه</span>
</div>
@endif
```

### 5. إزالة نوع العميل
تم إزالة عرض "نوع العميل" من صفحة الطباعة كما طلب المستخدم.

## النتيجة

✅ **الرصيد المدين صحيح**: الآن يتم حفظ الرصيد المدين الحقيقي للعميل وقت إنشاء الفاتورة  
✅ **حساب دقيق**: الإجمالي الفعلي = إجمالي البضاعة + الرصيد المدين المحفوظ  
✅ **بيانات ثابتة**: الرصيد المدين لا يتغير مع الوقت لأنه محفوظ في الفاتورة  
✅ **إزالة نوع العميل**: لم يعد يظهر في صفحة الطباعة  
✅ **فاتورات قديمة صحيحة**: الفواتير القديمة ستحتوي على الرصيد المدين الصحيح  

## الملفات المعدلة

### Database:
- `database/migrations/2025_09_14_222614_add_customer_balance_at_invoice_creation_to_sales_invoices_table.php`

### Backend:
- `app/Models/SalesInvoice.php`
- `app/Http/Controllers/SalesInvoiceController.php`

### Frontend:
- `resources/views/sales-invoices/print.blade.php`

## ملاحظات مهمة

1. **الرصيد المدين محفوظ**: يتم حفظ الرصيد المدين للعميل وقت إنشاء الفاتورة
2. **بيانات ثابتة**: الرصيد المدين في الفاتورة لا يتغير حتى لو تغير رصيد العميل لاحقاً
3. **حساب دقيق**: الإجمالي الفعلي = إجمالي البضاعة + الرصيد المدين المحفوظ
4. **فاتورات قديمة**: الفواتير القديمة ستحتوي على الرصيد المدين الصحيح بعد تشغيل الـ migration

