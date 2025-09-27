<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اختبار الطباعة</title>
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

        .test-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border: 2px solid #333;
            padding: 30px;
            text-align: center;
        }

        .header {
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .test-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c5aa0;
        }

        .test-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }

        .info-label {
            font-weight: bold;
            color: #666;
        }

        .info-value {
            color: #333;
        }

        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #c3e6cb;
        }

        .instructions {
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #ffeaa7;
            text-align: right;
        }

        @media print {
            body {
                padding: 0;
            }
            
            .no-print {
                display: none;
            }
        }

        .print-button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
        }

        .print-button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="test-container">
        <div class="header">
            <div class="company-name">شركة عطارة العسل</div>
            <div class="test-title">اختبار الطباعة</div>
            <div class="success-message">
                ✅ تم إرسال مهمة الطباعة بنجاح عبر QZ Tray
            </div>
        </div>

        <div class="test-info">
            <div class="info-row">
                <span class="info-label">التاريخ:</span>
                <span class="info-value">{{ date('Y-m-d H:i:s') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">الوقت:</span>
                <span class="info-value">{{ date('H:i:s') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">حالة الاتصال:</span>
                <span class="info-value">✅ متصل</span>
            </div>
            <div class="info-row">
                <span class="info-label">نوع الاختبار:</span>
                <span class="info-value">اختبار طباعة QZ Tray</span>
            </div>
        </div>

        <div class="instructions">
            <h3>تعليمات:</h3>
            <ul>
                <li>إذا ظهرت هذه الصفحة مطبوعة، فمعنى ذلك أن QZ Tray يعمل بشكل صحيح</li>
                <li>تأكد من أن الطابعة متصلة ومشغلة</li>
                <li>إذا لم تطبع، تحقق من إعدادات الطابعة</li>
            </ul>
        </div>

        <div class="no-print">
            <button class="print-button" onclick="window.print()">طباعة مباشرة</button>
            <button class="print-button" onclick="window.close()">إغلاق النافذة</button>
        </div>
    </div>
</body>
</html>
