<?php

namespace App\Http\Controllers;

use App\Models\PrintJob;
use Illuminate\Http\Request;

class PrintJobController extends Controller
{
    // إضافة أمر جديد من الموبايل
    public function store(Request $request)
    {
        $job = PrintJob::create([
            'invoice_id' => $request->invoice_id,
            // 'printer_name' => 'Samsung M332x 382x 402x Series',
            // 'printer_name' => $request->printer_name ?? 'Samsung Universal Print Driver 2',
            'printer_name' => $request->printer_name ?? 'Samsung M332x 382x 402x Series',
            'type' => $request->type ?? 'sales',
        ]);

        return response()->json(['status' => 'queued', 'job' => $job]);
    }

    // جلب كل الـ jobs الغير مطبوعة
    public function index()
    {
        return PrintJob::where('printed', false)->get();
    }

    // تحديث أمر الطباعة بعد التنفيذ
    public function done(PrintJob $job)
    {
        $job->update(['printed' => true]);
        return response()->json(['ok' => true]);
    }
}
