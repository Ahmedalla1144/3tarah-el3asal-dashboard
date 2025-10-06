import qz from 'qz-tray';

/**
 * Configure QZ Tray for development (free mode).
 * ⚠️ This will show security prompts. Silent printing requires a signed certificate.
 */
export function configureQZ(): void {
    qz.security.setCertificatePromise(function (resolve: (value: unknown) => void, reject: (reason?: unknown) => void) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/qz/cert', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject('Failed to load certificate, status ' + xhr.status);
                }
            }
        };
        xhr.send();
    });

    qz.security.setSignatureAlgorithm('SHA512');

    qz.security.setSignaturePromise(function (toSign: string) {
        return function (resolve: (value: unknown) => void, reject: (reason?: unknown) => void) {
            // هنا ممكن تستخدم XMLHttpRequest بدل fetch
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/qz/sign', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const resp = JSON.parse(xhr.responseText);
                            resolve(resp.signature); // نرجّع signature
                        } catch (e) {
                            reject('Invalid JSON: ' + e);
                        }
                    } else {
                        reject('Failed signing, status ' + xhr.status);
                    }
                }
            };

            xhr.send(JSON.stringify({ data: toSign }));
        };
    });
}

/**
 * Ensure QZ Tray websocket connection is active
 */
export async function ensureQZConnected(): Promise<void> {
    if (!qz.websocket.isActive()) {
        console.warn('QZ Tray is not connected');
        qz.websocket.connect().then(function () {
            // console.log('Connected to QZ Tray');
        });
    }
    window.location.assign('qz:launch');
    //Retry 5 times, pausing 1 second between each attempt
    startConnection({ retries: 5, delay: 1 });
}

function startConnection(config: { retries: number; delay: number }) {
    if (!qz.websocket.isActive()) {
        qz.websocket.connect(config).then(function () {
            // console.log('Connected to QZ Tray');
        });
    }
}

/**
 * List available printers
 */
export async function listPrinters(): Promise<string[]> {
    await ensureQZConnected();
    const printers = await qz.printers.find();
    return printers;
}

/**
 * Print raw text to a printer
 */
export async function printRawToPrinter(printer: string, raw: string): Promise<void> {
    await ensureQZConnected();
    const cfg = qz.configs.create(printer, { copies: 1 });
    const data = [{ type: 'raw', format: 'command', flavor: 'plain', data: [raw] }];
    await qz.print(cfg, data);
}

/**
 * Get default printer
 */
export async function getDefaultPrinter(): Promise<string> {
    await ensureQZConnected();
    return qz.printers.getDefault();
}

/**
 * Print a URL (QZ Tray fetches the HTML)
 */
export async function printUrlToPrinter(printer: string, url: string): Promise<void> {
    await ensureQZConnected();
    const cfg = qz.configs.create(printer, { copies: 1, margins: 0 });

    // هات HTML من السيرفر

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch invoice HTML: ${response.status}`);
    }
    const html = await response.text();

    if (!html || html.trim() === '') {
        throw new Error('Invoice HTML is empty');
    }
    let wrappedHtml = html;

    // QZ محتاج HTML كامل
    if (!html.toLowerCase().includes('<html')) {
        wrappedHtml = `
            <html>
                <head><meta charset="UTF-8"></head>
                <body>${html}</body>
            </html>
        `;
    }

    console.log(wrappedHtml);

    // Try to inline the Cairo font (base64) so QZ's HTML renderer can render Arabic correctly
    try {
        const fontResp = await fetch('/qz/font-base64');
        if (fontResp.ok) {
            const fontB64 = await fontResp.text();
            const bwCss = `
                <style>
                    /* Force black & white for printing */
                    @media print { html, body { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    * { color: #000 !important; background: transparent !important; background-color: #fff !important; background-image: none !important; box-shadow: none !important; text-shadow: none !important; border-color: #000 !important; }
                    img, svg { filter: grayscale(100%) !important; -webkit-filter: grayscale(100%) !important; color: #000 !important; }
                    svg * { fill: #000 !important; stroke: #000 !important; }
                    table, th, td { border-color: #000 !important; }
                    a { color: #000 !important; text-decoration: none !important; }
                </style>`;

            const fontCss = `<style>@font-face{font-family: 'CairoInline';src: url(data:font/truetype;charset=utf-8;base64,${fontB64}) format('truetype');font-weight: normal;font-style: normal;}body{font-family: CairoInline, sans-serif !important;}</style>`;
            const combinedCss = fontCss + bwCss;
            // inject into head if present, otherwise prepend full html
            if (wrappedHtml.toLowerCase().includes('<head')) {
                wrappedHtml = wrappedHtml.replace(/<head(.*?)>/i, `$&${combinedCss}`);
            } else if (wrappedHtml.toLowerCase().includes('<html')) {
                wrappedHtml = wrappedHtml.replace(/<html(.*?)>/i, `$&<head>${combinedCss}</head>`);
            } else {
                wrappedHtml = `<html><head>${combinedCss}<meta charset="UTF-8"></head><body>${wrappedHtml}</body></html>`;
            }
        }
    } catch (e) {
        console.warn('Failed to inline font for QZ print:', e);
    }

    const data = [{ type: 'html', format: 'plain', data: wrappedHtml }];

    await qz.print(cfg, data);
}
export default qz;
