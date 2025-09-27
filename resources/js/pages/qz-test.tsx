import { useState, useEffect } from 'react';
import AppLayout  from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { configureQZ, listPrinters, printUrlToPrinter, ensureQZConnected } from '@/lib/qz';
import qz from 'qz-tray';
import { CheckCircle, XCircle, AlertCircle, Printer } from 'lucide-react';

const CERT = `-----BEGIN CERTIFICATE-----
MIIDoTCCAomgAwIBAgIUJ5zuLz7MskF5tC/khHGkaUx6Ge4wDQYJKoZIhvcNAQEL
BQAwYDELMAkGA1UEBhMCRUcxDjAMBgNVBAgMBUNhaXJvMQ4wDAYDVQQHDAVDYWly
bzEQMA4GA1UECgwHQ29tcGFueTELMAkGA1UECwwCSVQxEjAQBgNVBAMMCWxvY2Fs
aG9zdDAeFw0yNTA5MjcwOTU5MDlaFw0yNjA5MjcwOTU5MDlaMGAxCzAJBgNVBAYT
AkVHMQ4wDAYDVQQIDAVDYWlybzEOMAwGA1UEBwwFQ2Fpcm8xEDAOBgNVBAoMB0Nv
bXBhbnkxCzAJBgNVBAsMAklUMRIwEAYDVQQDDAlsb2NhbGhvc3QwggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQClCcITr3qpIymTLZ6STEIauO0CJCyQzSYP
S2GbKMVlhERoa8P93MJinmft4zsxmzzqQbrG7ujoGWlUhX0JZ+wV5h6gA+4/Gcts
lDJTlq5BRjSHWM6AH/JhD8r6Y679UfRHGM8dqP7yUfyavUQyNAAzZ+k+o9dRF7a2
sxfwO9u3JWv2mS5f6g0kLESl3AaBs9N5YBJpgJ4VdjmfyGscpORj0LrPuRxb8szH
CyRJARPDOPVOgBEqEsqp2TCMH6AxTzExHVkqHuYvs3bvvjY2SkkGAHwZ/raEDZh4
DeijJhmOXb4i4srpxw6eFjPjRY/Zg5DCLJvAJHiX2a1tVHZFfh3PAgMBAAGjUzBR
MB0GA1UdDgQWBBQufnv6r3laPAJmJqb7BEGFyyQm3DAfBgNVHSMEGDAWgBQufnv6
r3laPAJmJqb7BEGFyyQm3DAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUA
A4IBAQAz8jaqn/GPu4O2iycJgB/L1y8bnM/WqHEXNFIOxxr4MIOHTLfPTiAZDe7k
ypqPaM+V3XyASVMJgh09yu1pPTlwA2YBJ6zu7fx1L2IkSYJgMUaMcJ4kDXCqImuK
pBO8wUgXwSXTLQWyaWE8VD4euyh1cOrGO52R0loPs+whAkaHy79FkPcBpaHbOVQX
vt5bDxhr1U5bQekCNIEpkv7RNGGi5+o2g92kpcsS9H5gynI7Sx1a2qb4G2bh8pAg
sBM96Kh2NtJTTeP6dB1pKBGcgXxNP1QxbtBEqr4hdf8Z0BQ1kP+NZWg+yjJET1sB
8IwfkKbAGG8pI9on00QlJjNbFxS0
-----END CERTIFICATE-----`;

interface QZStatus {
    isConnected: boolean;
    printers: string[];
    selectedPrinter: string;
    error: string | null;
    lastTest: string | null;
}

export default function QZTest() {
    const [status, setStatus] = useState<QZStatus>({
        isConnected: false,
        printers: [],
        selectedPrinter: '',
        error: null,
        lastTest: null
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        initializeQZ();
    }, []);

    const initializeQZ = async () => {
        try {
            setStatus(prev => ({ ...prev, error: null }));
            configureQZ('/qz/sign', CERT);
            
            // اختبار الاتصال
            await ensureQZConnected();
            setStatus(prev => ({ ...prev, isConnected: true }));
            
            // جلب قائمة الطابعات
            const printers = await listPrinters();
            setStatus(prev => ({ 
                ...prev, 
                printers,
                selectedPrinter: printers.length > 0 ? printers[0] : ''
            }));
            
        } catch (error) {
            console.error('QZ initialization error:', error);
            setStatus(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'خطأ غير معروف',
                isConnected: false 
            }));
        }
    };

    const testPrint = async () => {
        if (!status.selectedPrinter) {
            setStatus(prev => ({ ...prev, error: 'يرجى اختيار طابعة أولاً' }));
            return;
        }

        setIsLoading(true);
        try {
            const testUrl = `${window.location.origin}/test-print`;
            await printUrlToPrinter(status.selectedPrinter, testUrl);
            setStatus(prev => ({ 
                ...prev, 
                error: null,
                lastTest: `تم إرسال مهمة طباعة تجريبية إلى ${status.selectedPrinter} بنجاح`
            }));
        } catch (error) {
            console.error('Print test error:', error);
            setStatus(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'فشل في إرسال مهمة الطباعة'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const refreshPrinters = async () => {
        setIsLoading(true);
        try {
            const printers = await listPrinters();
            setStatus(prev => ({ 
                ...prev, 
                printers,
                selectedPrinter: printers.length > 0 ? printers[0] : '',
                error: null
            }));
        } catch (error) {
            setStatus(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'فشل في جلب قائمة الطابعات'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">اختبار QZ Tray</h1>
                    <p className="text-muted-foreground mt-2">
                        صفحة لاختبار وإعداد QZ Tray للطباعة
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* حالة الاتصال */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {status.isConnected ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                حالة الاتصال بـ QZ Tray
                            </CardTitle>
                            <CardDescription>
                                حالة الاتصال بخدمة QZ Tray
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>الاتصال:</span>
                                    <span className={`font-medium ${status.isConnected ? 'text-green-600' : 'text-red-600'}`}>
                                        {status.isConnected ? 'متصل' : 'غير متصل'}
                                    </span>
                                </div>
                                
                                <Button onClick={initializeQZ} disabled={isLoading}>
                                    {isLoading ? 'جاري المحاولة...' : 'إعادة الاتصال'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* قائمة الطابعات */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Printer className="h-5 w-5" />
                                الطابعات المتاحة
                            </CardTitle>
                            <CardDescription>
                                قائمة الطابعات المتصلة بالكمبيوتر
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        اختر طابعة:
                                    </label>
                                    <select 
                                        className="w-full rounded border px-3 py-2"
                                        value={status.selectedPrinter}
                                        onChange={(e) => setStatus(prev => ({ ...prev, selectedPrinter: e.target.value }))}
                                    >
                                        <option value="">اختر طابعة</option>
                                        {status.printers.map(printer => (
                                            <option key={printer} value={printer}>{printer}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <Button onClick={refreshPrinters} disabled={isLoading}>
                                    {isLoading ? 'جاري التحديث...' : 'تحديث القائمة'}
                                </Button>
                                
                                <div className="text-sm text-muted-foreground">
                                    تم العثور على {status.printers.length} طابعة
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* اختبار الطباعة */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>اختبار الطباعة</CardTitle>
                        <CardDescription>
                            إرسال مهمة طباعة تجريبية للطابعة المحددة
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Button 
                                onClick={testPrint} 
                                disabled={!status.selectedPrinter || isLoading}
                                className="w-full"
                            >
                                {isLoading ? 'جاري الطباعة...' : 'اختبار الطباعة'}
                            </Button>
                            
                            {status.lastTest && (
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {status.lastTest}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* رسائل الخطأ */}
                {status.error && (
                    <Alert className="mt-6" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {status.error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* تعليمات الاستخدام */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>تعليمات الاستخدام</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div>
                                <strong>1. تأكد من تشغيل QZ Tray:</strong>
                                <p className="text-muted-foreground">
                                    يجب أن يكون برنامج QZ Tray يعمل على الكمبيوتر
                                </p>
                            </div>
                            <div>
                                <strong>2. إضافة الثقة للموقع:</strong>
                                <p className="text-muted-foreground">
                                    عند أول استخدام، سيطلب QZ Tray إضافة ثقة للموقع. اضغط "Trust" للمتابعة
                                </p>
                            </div>
                            <div>
                                <strong>3. اختبار الاتصال:</strong>
                                <p className="text-muted-foreground">
                                    استخدم زر "إعادة الاتصال" لاختبار الاتصال بـ QZ Tray
                                </p>
                            </div>
                            <div>
                                <strong>4. تحديث الطابعات:</strong>
                                <p className="text-muted-foreground">
                                    استخدم زر "تحديث القائمة" لجلب أحدث قائمة بالطابعات المتاحة
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
