import qz from 'qz-tray';

// QZ Tray setup and helpers for secure printing
// Requires backend signing endpoints

type SignResponse = { signature: string };

export function configureQZ(signingUrl: string, certificate: string) {
    qz.security.setCertificatePromise(() => Promise.resolve(certificate));

    qz.security.setSignaturePromise((toSign: string) => {
        return fetch(signingUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: toSign }),
        })
            .then((res) => res.json())
            .then((r: SignResponse) => r.signature);
    });

    // تأكيد نوع الـ Promise
    qz.api.setPromiseType(function promise(resolver: (value: unknown) => void) {
        return new Promise(resolver);
    });
}

export async function ensureQZConnected(): Promise<void> {
    if (qz.websocket.isActive()) return;
    await qz.websocket.connect();
}

export async function listPrinters(): Promise<string[]> {
    try {
        await ensureQZConnected();
        const printers = await qz.printers.find();
        console.log('Available printers:', printers);
        return printers;
    } catch (error) {
        console.error('Error listing printers:', error);
        throw error;
    }
}

export async function printHtmlToPrinter(printer: string, html: string): Promise<void> {
    await ensureQZConnected();
    const cfg = qz.configs.create(printer, { copies: 1, margins: 0 });
    const data = [{ type: 'html', format: 'plain', data: html }];
    await qz.print(cfg, data);
}

export async function printUrlToPrinter(printer: string, url: string): Promise<void> {
    try {
        await ensureQZConnected();
        const cfg = qz.configs.create(printer, { copies: 1, margins: 0 });
        const data = [{ type: 'html', data: url }];
        console.log('Printing to printer:', printer, 'URL:', url);
        await qz.print(cfg, data);
        console.log('Print job sent successfully');
    } catch (error) {
        console.error('Error printing:', error);
        throw error;
    }
}

export default qz;
