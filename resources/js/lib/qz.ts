import qz from 'qz-tray'

// QZ Tray setup and helpers for secure printing
// Requires backend signing endpoints

type SignResponse = { signature: string }

export function configureQZ(signingUrl: string) {
    qz.api.setPromiseType(function promise(resolver: (value: unknown) => void) {
        return new Promise(resolver)
    })

    qz.security.setSignaturePromise((toSign: string) => {
        return fetch(signingUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: toSign })
        }).then(res => res.json()).then((r: SignResponse) => r.signature)
    })
}

export async function ensureQZConnected(): Promise<void> {
    if (qz.websocket.isActive()) return
    await qz.websocket.connect()
}

export async function listPrinters(): Promise<string[]> {
    await ensureQZConnected()
    return qz.printers.find()
}

export async function printHtmlToPrinter(printer: string, html: string): Promise<void> {
    await ensureQZConnected()
    const cfg = qz.configs.create(printer, { copies: 1, margins: 0 })
    const data = [{ type: 'html', format: 'plain', data: html }]
    await qz.print(cfg, data)
}

export async function printUrlToPrinter(printer: string, url: string): Promise<void> {
    await ensureQZConnected()
    const cfg = qz.configs.create(printer, { copies: 1, margins: 0 })
    const data = [{ type: 'html', data: url }]
    await qz.print(cfg, data)
}

export default qz


