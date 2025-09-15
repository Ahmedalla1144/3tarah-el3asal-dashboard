# إصلاح مشاكل تنسيق الأرقام في التطبيق

## المشاكل التي تم إصلاحها

### 1. مشكلة عرض الإجمالي في فواتير المبيعات
- **المشكلة**: كان `total` في `InvoiceItem` يظهر كـ `0 ج.م` رغم وجود كمية وسعر صحيح
- **السبب**: البيانات كانت تأتي مباشرة من النموذج بدون معالجة صحيحة
- **الحل**: إصلاح طريقة عرض البيانات في `SalesInvoiceController::show()`

### 2. تنسيق الأرقام غير موحد
- **المشكلة**: الأرقام كانت تظهر بتنسيقات مختلفة في الصفحات المختلفة
- **السبب**: عدم وجود دالة موحدة لتنسيق الأرقام
- **الحل**: إنشاء دالتين موحدتين في `resources/js/lib/currency.ts`

## الإصلاحات المطبقة

### 1. إصلاح عرض بيانات فواتير المبيعات
```php
// في SalesInvoiceController::show()
return Inertia::render('sales-invoices/show', [
    'invoice' => [
        // ... بيانات الفاتورة
        'items' => $salesInvoice->items->map(function($item) {
            return [
                // ... بيانات البند
                'total' => (float)$item->line_total  // استخدام line_total بدلاً من total
            ];
        })
    ]
]);
```

### 2. تحسين دالة تنسيق العملة
```typescript
// في resources/js/lib/currency.ts
export function formatEGP(value: number | null | undefined): string {
    const n = typeof value === 'number' ? value : Number(value ?? 0)
    
    if (!Number.isFinite(n)) {
        return '0 ج.م'
    }
    
    // استخدام التنسيق الإنجليزي للأرقام
    const formatter = new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2,
        useGrouping: true
    })
    
    const formatted = formatter.format(n)
    return `${formatted} ج.م`
}
```

### 3. إضافة دالة تنسيق الأرقام العادية
```typescript
export function formatNumber(value: number | null | undefined): string {
    const n = typeof value === 'number' ? value : Number(value ?? 0)
    
    if (!Number.isFinite(n)) {
        return '0'
    }
    
    const formatter = new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 3,
        useGrouping: true
    })
    
    return formatter.format(n)
}
```

### 4. تطبيق التنسيق الموحد على جميع الصفحات

#### الصفحات المحدثة:
1. **صفحة عرض فاتورة المبيعات** (`sales-invoices/show.tsx`)
   - إصلاح عرض الإجمالي
   - تطبيق تنسيق الأرقام على الكميات

2. **صفحة عرض فاتورة الشراء** (`purchase-invoices/show.tsx`)
   - تطبيق تنسيق الأرقام على الكميات

3. **صفحة المنتجات** (`products/index.tsx`)
   - تطبيق تنسيق الأرقام على المخزون والحد الأدنى

4. **صفحة العملاء** (`customers/index.tsx`)
   - تحسين تنسيق الأرقام

5. **صفحة الداشبورد** (`dashboard.tsx`)
   - تطبيق تنسيق الأرقام على جميع الأرقام

6. **صفحات فهارس الفواتير**
   - تحسين تنسيق الأرقام في الجداول

## النتيجة

✅ **عرض صحيح للإجماليات**: الآن الإجمالي يظهر بشكل صحيح في فواتير المبيعات  
✅ **تنسيق موحد للأرقام**: جميع الأرقام تستخدم نفس التنسيق الإنجليزي  
✅ **فصل العملات عن الأرقام**: دالة منفصلة لتنسيق العملات وأخرى للأرقام العادية  
✅ **معالجة الأخطاء**: التعامل مع القيم الفارغة أو غير الصحيحة  
✅ **تنسيق إنجليزي للأرقام**: استخدام `en-US` locale للأرقام الإنجليزية  

## الملفات المعدلة

### Backend:
- `app/Http/Controllers/SalesInvoiceController.php`

### Frontend:
- `resources/js/lib/currency.ts`
- `resources/js/pages/sales-invoices/show.tsx`
- `resources/js/pages/purchase-invoices/show.tsx`
- `resources/js/pages/products/index.tsx`
- `resources/js/pages/customers/index.tsx`
- `resources/js/pages/dashboard.tsx`
