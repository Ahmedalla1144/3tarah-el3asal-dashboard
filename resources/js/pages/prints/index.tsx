import { useEffect, useState, useRef } from "react";
import qz from "qz-tray";
import { configureQZ, ensureQZConnected, printUrlToPrinter } from "@/lib/qz";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { PrintJob, type BreadcrumbItem } from "@/types";

export default function PrintWorkerPage() {
    const [status, setStatus] = useState<"متوقف" | "يعمل" | "خامل">("متوقف");
    const [lastJob, setLastJob] = useState<PrintJob | null>(null);
    const [idleCount, setIdleCount] = useState<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const MAX_IDLE = 3600;

    const startWorker = () => {
        if (intervalRef.current) return;
        setStatus("يعمل");
        setIdleCount(0);

        console.log("⏳ بدء عامل الطباعة...");

        intervalRef.current = setInterval(async () => {
            try {
                console.log("🔍 فحص أوامر الطباعة...");
                const res = await fetch("/print-jobs");
                const jobs: PrintJob[] = await res.json();

                if (!jobs || jobs.length === 0) {
                    setIdleCount((prev) => {
                        const next = prev + 10;

                        if (next >= MAX_IDLE) {
                            console.log("🛑 لا توجد أوامر جديدة، تم إيقاف عامل الطباعة تلقائيًا.");
                            stopWorker(); // يقفل العامل
                            return 0;
                        } else {
                            // حالة خمول
                            setStatus((s) => (s !== "متوقف" ? "خامل" : s));
                            return next;
                        }
                    });
                    return;
                }

                // لو فيه شغل، صفّر العداد وغيّر الحالة
                setIdleCount(0);
                setStatus("يعمل");

                for (const job of jobs) {
                    const printer =
                        job.printer_name && job.printer_name.length > 0
                            ? job.printer_name
                            : await qz.printers.getDefault();

                    let printUrl = "";
                    if (job.type === "purchase") {
                        printUrl = `${window.location.origin}/purchase-invoices/${job.invoice_id}/print?qz=1`;
                    } else {
                        printUrl = `${window.location.origin}/sales-invoices/${job.invoice_id}/print?qz=1`;
                    }

                    await printUrlToPrinter(printer, printUrl);
                    setLastJob(job);

                    await fetch(`/print-jobs/${job.id}/done`, { method: "POST" });
                }
            } catch (err) {
                console.error("❌ خطأ في عامل الطباعة:", err);
                stopWorker();
            }
        }, 10000);
    };

    const stopWorker = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setStatus("متوقف");
        setIdleCount(0);
        console.log("🛑 تم إيقاف عامل الطباعة.");
    };

    useEffect(() => {
        configureQZ();
        ensureQZConnected();
        startWorker();
        return () => stopWorker();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "عامل الطباعة", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="عامل الطباعة" />

            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold">⚙️ عامل الطباعة</h1>

                <div className="flex gap-2">
                    <button
                        onClick={startWorker}
                        disabled={status === "يعمل"}
                        className="px-4 py-2 rounded bg-green-600 text-white"
                    >
                        تشغيل
                    </button>
                    <button
                        onClick={stopWorker}
                        disabled={status === "متوقف"}
                        className="px-4 py-2 rounded bg-red-600 text-white"
                    >
                        إيقاف
                    </button>
                </div>

                <div className="space-y-2">
                    <p>الحالة الحالية: <strong>{status}</strong></p>
                    {lastJob && (
                        <p>🖨️ آخر فاتورة مطبوعة: <strong>#{lastJob.invoice_id}</strong> (نوع: {lastJob.type})</p>
                    )}
                    {status === "خامل" && (
                        <p className="text-yellow-500">
                            ⚠️ لا توجد أوامر جديدة، سيتوقف العامل تلقائيًا بعد{" "}
                            <strong>
                                {(() => {
                                    const remaining = MAX_IDLE - idleCount;
                                    const minutes = Math.floor(remaining / 60);
                                    const seconds = remaining % 60;
                                    return minutes > 0
                                        ? `${minutes} دقيقة و ${seconds} ثانية`
                                        : `${seconds} ثانية`;
                                })()}
                            </strong>.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
