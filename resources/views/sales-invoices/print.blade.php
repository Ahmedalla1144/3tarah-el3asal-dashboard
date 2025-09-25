<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/logo2.svg" />
    <title>فاتورة مبيعات #{{ $invoice->number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            background: white;
            padding: 20px;
        }

        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 1px solid #ddd;
            padding: 30px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .invoice-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .invoice-number {
            font-size: 16px;
            color: #666;
        }

        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .customer-info, .invoice-info {
            flex: 1;
            padding: 0 10px;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .info-label {
            font-weight: bold;
            color: #666;
        }

        .info-value {
            color: #333;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .items-table th {
            background-color: #f5f5f5;
            padding: 12px 8px;
            text-align: right;
            font-weight: bold;
            border: 1px solid #ddd;
        }

        .items-table td {
            padding: 10px 8px;
            border: 1px solid #ddd;
            text-align: right;
        }

        .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .summary {
            margin-left: auto;
            width: 300px;
            border: 1px solid #ddd;
            padding: 20px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
        }

        .summary-label {
            font-weight: bold;
        }

        .summary-value {
            font-weight: bold;
        }

        .total-row {
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 10px;
            font-size: 16px;
        }

        .debit-balance {
            color: #d32f2f;
        }

        .final-total {
            color: #d32f2f;
            font-size: 18px;
        }

        .notes {
            margin-top: 30px;
            padding: 15px;
            background-color: #f9f9f9;
            border-right: 4px solid #333;
        }

        .notes-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        @media print {
            body {
                padding: 0;
            }

            .invoice-container {
                border: none;
                padding: 20px;
            }

            .no-print {
                display: none;
            }
        }

        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }

        .print-button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">طباعة</button>

    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="company-name">عطارة العسال</div>
            <div class="invoice-title">فاتورة مبيعات</div>
            <div class="invoice-number">رقم الفاتورة: {{ $invoice->number }}</div>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details">
            <div class="customer-info">
                <div class="section-title">بيانات العميل</div>
                <div class="info-row">
                    <span class="info-label">الاسم:</span>
                    <span class="info-value">{{ $invoice->customer ? $invoice->customer->name : 'غير محدد' }}</span>
                </div>
                @if($invoice->customer && $invoice->customer_balance_at_creation > 0)
                <div class="info-row">
                    <span class="info-label">الرصيد المدين:</span>
                    <span class="info-value debit-balance">{{ rtrim(rtrim(number_format($invoice->customer_balance_at_creation, 2), '0'), '.') }} جنيه</span>
                </div>
                @endif
            </div>

            <div class="invoice-info">
                <div class="section-title">بيانات الفاتورة</div>
                <div class="info-row">
                    <span class="info-label">التاريخ:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($invoice->date)->format('Y-m-d') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">المستودع:</span>
                    <span class="info-value">{{ $invoice->warehouse ? $invoice->warehouse->name : 'غير محدد' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">الحالة:</span>
                    <span class="info-value">{{ $invoice->status === 'paid' ? 'مدفوعة' : 'غير مدفوعة' }}</span>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">#</th>
                    <th style="width: 30%;">اسم المنتج</th>
                    <th style="width: 15%;">الوحدة</th>
                    <th style="width: 10%;">الكمية</th>
                    <th style="width: 15%;">سعر الوحدة</th>
                    <th style="width: 10%;display: none;">الخصم</th>
                    <th style="width: 10%;display: none;">الضريبة</th>
                    <th style="width: 15%;">الإجمالي</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->product->name }}</td>
                    <td>{{ $item->unit->name }}</td>
                    <td>{{ number_format($item->qty, 0) }}</td>
                    <td>{{ rtrim(rtrim(number_format($item->unit_price, 2), '0'), '.') }} جنيه</td>
                    <td style="display: none;">{{ rtrim(rtrim(number_format($item->discount_value, 2), '0'), '.') }} جنيه</td>
                    <td style="display: none;">{{ rtrim(rtrim(number_format($item->tax_value, 2), '0'), '.') }} جنيه</td>
                    <td>{{ rtrim(rtrim(number_format($item->line_total, 2), '0'), '.') }} جنيه</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
            <div class="summary-row">
                <span class="summary-label">إجمالي البضاعة:</span>
                <span class="summary-value">{{ rtrim(rtrim(number_format($invoice->total, 2), '0'), '.') }} جنيه</span>
            </div>

            @if($invoice->customer && $invoice->customer_balance_at_creation > 0)
            <div class="summary-row debit-balance">
                <span class="summary-label">الرصيد المدين:</span>
                <span class="summary-value">{{ rtrim(rtrim(number_format($invoice->customer_balance_at_creation, 2), '0'), '.') }} جنيه</span>
            </div>

            <div class="summary-row total-row final-total">
                <span class="summary-label">الإجمالي الفعلي:</span>
                <span class="summary-value">{{ rtrim(rtrim(number_format($invoice->total + $invoice->customer_balance_at_creation, 2), '0'), '.') }} جنيه</span>
            </div>
            @endif

            <div class="summary-row">
                <span class="summary-label">المدفوع:</span>
                <span class="summary-value">{{ rtrim(rtrim(number_format($invoice->paid_amount, 2), '0'), '.') }} جنيه</span>
            </div>

            <div class="summary-row total-row">
                <span class="summary-label">المتبقي:</span>
                <span class="summary-value">
                    @if($invoice->customer && $invoice->customer_balance_at_creation > 0)
                        {{ rtrim(rtrim(number_format(($invoice->total + $invoice->customer_balance_at_creation) - $invoice->paid_amount, 2), '0'), '.') }} جنيه
                    @else
                        {{ rtrim(rtrim(number_format($invoice->total - $invoice->paid_amount, 2), '0'), '.') }} جنيه
                    @endif
                </span>
            </div>
        </div>

        <!-- Notes -->
        @if($invoice->notes)
        <div class="notes">
            <div class="notes-title">ملاحظات:</div>
            <div>{{ $invoice->notes }}</div>
        </div>
        @endif
    </div>
</body>
</html>
