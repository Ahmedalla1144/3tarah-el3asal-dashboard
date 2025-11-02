<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/logo2.svg" />
    <title>فاتورة شراء #{{ $invoice->number }}</title>
    <style>
        @font-face {
            font-family: 'Cairo';
            src: url('/fonts/Cairo-VariableFont_slnt,wght.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Cairo', sans-serif;
            font-size: 14px;
            color: #333;
            background: white;
            padding: 20px;
            direction: rtl;
            text-align: right;
            line-height: 1.6;
        }

        .invoice-container {
            direction: rtl;
            unicode-bidi: bidi-override;
            text-align: right;
            max-width: 510px;
            margin: 0 auto;
            background: white;
            border: 1px solid #ddd;
            padding: 12px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 2px solid #333;
            padding-bottom: 8px;
        }

        .header-left {
            flex: 1;
            text-align: right;
        }

        .company-name {
            font-size: 17px;
            font-weight: bold;
            margin: 0;
        }

        .header-right {
            flex: 1;
            text-align: left;
        }

        .invoice-title {
            font-size: 15px;
            font-weight: bold;
            margin: 0;
        }

        .invoice-number {
            font-size: 13px;
            color: #666;
            margin-top: 2px;
        }

        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .supplier-info,
        .invoice-info {
            flex: 1;
            padding: 0 5px;
        }

        .section-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 3px;
            color: #333;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
        }

        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 13px;
        }

        .info-value {
            color: #333;
            font-size: 13px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        td,
        th {
            font-variant-ligatures: none;
            -webkit-font-smoothing: antialiased;
            text-rendering: geometricPrecision;
            direction: rtl;
            white-space: pre;
        }

        .items-table th {
            background-color: #f5f5f5;
            padding: 5px 3px;
            text-align: right;
            font-weight: bold;
            border: 1px solid #ddd;
            font-size: 13px;
        }

        .items-table td {
            padding: 4px 3px;
            border: 1px solid #ddd;
            text-align: right;
            font-size: 13px;
        }

        .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .summary {
            margin-left: auto;
            width: 200px;
            border: 1px solid #ddd;
            padding: 8px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
            padding: 2px 0;
        }

        .summary-label {
            font-weight: bold;
            font-size: 13px;
        }

        .summary-value {
            font-weight: bold;
            font-size: 13px;
        }

        .total-row {
            border-top: 2px solid #333;
            padding-top: 5px;
            margin-top: 5px;
            font-size: 14px;
        }

        .notes {
            margin-top: 10px;
            padding: 8px;
            background-color: #f9f9f9;
            border-right: 4px solid #333;
        }

        .notes-title {
            font-weight: bold;
            margin-bottom: 3px;
            font-size: 13px;
        }

        .notes div {
            font-size: 13px;
        }

        @media print {
            body {
                padding: 0;
            }

            .invoice-container {
                border: none;
                padding: 10px;
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
    @if (!request()->query('qz'))
        <button class="print-button no-print" onclick="printViaQZ()">طباعة</button>
    @endif

    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <div class="company-name">عطارة العسال</div>
            </div>
            <div class="header-right">
                <div class="invoice-title">فاتورة مشتريات</div>
                <div class="invoice-number">رقم: {{ $invoice->number }}</div>
            </div>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details">
            <div class="supplier-info">
                <div class="section-title">بيانات المورد</div>
                <div class="info-row">
                    <span class="info-label">الاسم:</span>
                    <span class="info-value">{{ $invoice->supplier ? $invoice->supplier->name : 'غير محدد' }}</span>
                </div>
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
                    <th style="width: 10%;display: none">الخصم</th>
                    <th style="width: 10%;display: none">الضريبة</th>
                    <th style="width: 15%;">الإجمالي</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td @if(request()->query('qz')) style="direction:ltr; unicode-bidi:isolate-override; font-family:'Tahoma','Arial',sans-serif !important;" @endif>{{ $item->product->name }}</td>
                    <td @if(request()->query('qz')) style="direction:ltr; unicode-bidi:isolate-override; font-family:'Tahoma','Arial',sans-serif !important;" @endif>{{ $item->unit->name }}</td>
                    <td>{{ rtrim(rtrim(number_format($item->qty, 3), '0'), '.') }}</td>
                    <td>{{ rtrim(rtrim(number_format($item->unit_cost, 2), '0'), '.') }} جنيه</td>
                    <td style="display: none">{{ rtrim(rtrim(number_format($item->discount_value, 2), '0'), '.') }} جنيه</td>
                    <td style="display: none">{{ rtrim(rtrim(number_format($item->tax_value, 2), '0'), '.') }} جنيه</td>
                    <td>{{ rtrim(rtrim(number_format($item->line_total, 2), '0'), '.') }} جنيه</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
            <div class="summary-row">
                <span class="summary-label">إجمالي الفاتورة:</span>
                <span class="summary-value">{{ rtrim(rtrim(number_format($invoice->total, 2), '0'), '.') }} جنيه</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">المدفوع:</span>
                <span class="summary-value">{{ rtrim(rtrim(number_format($invoice->paid_amount, 2), '0'), '.') }} جنيه</span>
            </div>
            <div class="summary-row total-row">
                <span class="summary-label">المتبقي:</span>
                <span class="summary-value">{{ rtrim(rtrim(number_format($invoice->total - $invoice->paid_amount, 2), '0'), '.') }} جنيه</span>
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

    <!-- Scripts: html2canvas for capturing the invoice and QZ Tray integration -->
    <script>
        // Load html2canvas dynamically if not present
        (function loadHtml2Canvas() {
            if (window.html2canvas) return;
            var s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            s.crossOrigin = 'anonymous';
            document.head.appendChild(s);
        })();

        // Main print function used by the button
        async function printViaQZ() {
            // If qz is not available, fallback to native print
            if (typeof qz === 'undefined' || !qz) {
                console.warn('QZ Tray not found, falling back to window.print()');
                return window.print();
            }

            // Set your printer name here (exact system printer name)
            const printerName = window.QZ_PRINTER_NAME || '';
            if (!printerName) {
                if (!confirm('اسم الطابعة لم يتم تعيينه. هل تريد استخدام نافذة الطباعة الافتراضية بدلاً من QZ Tray؟')) {
                    return;
                }
                return window.print();
            }

            // Wait for fonts to be ready so Arabic webfont renders correctly in the canvas
            try {
                if (document.fonts && document.fonts.ready) await document.fonts.ready;
            } catch (e) {
                // ignore
            }

            // Wait until html2canvas is loaded
            await waitForHtml2canvas();

            const el = document.querySelector('.invoice-container');
            if (!el) return alert('لم أجد عنصر الفاتورة في الصفحة (.invoice-container)');

            // Quality settings
            const dpi = 300;
            const scale = 2;

            const elementHeight = el.offsetHeight;
            const elementWidth = el.offsetWidth;
            console.log(`Element dimensions: ${elementWidth}px x ${elementHeight}px`);

            const paperHeightMm = 140;
            const estimatedPageHeightPx = 1000;
            const pageHeightPx = estimatedPageHeightPx;

            console.log(`Calculated page height: ${pageHeightPx}px for ${paperHeightMm}mm paper`);

            try {
                console.log(`Starting html2canvas conversion...`);
                const canvas = await html2canvas(el, {
                    scale: scale,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#ffffff',
                    logging: true
                });
                console.log(`Canvas created: ${canvas.width}x${canvas.height}`);

                const images = sliceCanvasToBase64Pages(canvas, pageHeightPx);

                await qz.websocket.connect();
                const cfg = qz.configs.create(printerName, {
                    units: 'mm',
                    printerPaperSize: { width: 105, height: 140 }
                });

                for (let i = 0; i < images.length; i++) {
                    const base64 = images[i].split(',')[1];
                    const printData = [{ type: 'image', format: 'base64', data: base64 }];
                    try {
                        await qz.print(cfg, printData);
                    } catch (err) {
                        console.error('Error printing page', i, err);
                        alert('حدث خطأ أثناء الطباعة: ' + (err && err.message ? err.message : err));
                        break;
                    }
                    // small pause between pages
                    await sleep(300);
                }

                try { await qz.websocket.disconnect(); } catch (e) { /* ignore */ }
                const pageCount = images.length;
                alert(`تم إرسال ${pageCount} صفحة للطباعة عبر QZ Tray`);
            } catch (err) {
                console.error(err);
                alert('فشل تجهيـز صورة الطباعة، سيتم استخدام نافذة الطباعة التقليدية.\n\n' + (err && err.message ? err.message : err));
                window.print();
            }
        }

        // Helper: ensure html2canvas loaded
        function waitForHtml2canvas(timeout = 5000) {
            return new Promise((resolve, reject) => {
                const start = Date.now();
                (function check() {
                    if (window.html2canvas) return resolve();
                    if (Date.now() - start > timeout) return reject(new Error('html2canvas failed to load'));
                    setTimeout(check, 100);
                })();
            });
        }

        // Helper: sleep ms
        function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

        // Slice a tall canvas into page-height images (dataURLs)
        function sliceCanvasToBase64Pages(canvas, pageHeightPx) {
            const pages = [];
            const totalHeight = canvas.height;
            const width = canvas.width;
            let y = 0;

            console.log(`Canvas dimensions: ${width}x${totalHeight}, Page height: ${pageHeightPx}`);

            while (y < totalHeight) {
                const h = Math.min(pageHeightPx, totalHeight - y);
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = width;
                pageCanvas.height = h;
                const ctx = pageCanvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                ctx.drawImage(canvas, 0, y, width, h, 0, 0, width, h);
                pages.push(pageCanvas.toDataURL('image/png'));
                console.log(`Created page ${pages.length}: y=${y}, height=${h}`);
                y += h;
            }

            console.log(`Total pages created: ${pages.length}`);
            return pages;
        }

        // Optional: expose a quick way to set printer name from other scripts
        window.setQZPrinter = function (name) { window.QZ_PRINTER_NAME = name; };
    </script>

</body>

</html>


