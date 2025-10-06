<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class QzController extends Controller
{
    public function cert()
    {
        $certPath = storage_path('keys/qz_cert.pem');
        if (!file_exists($certPath)) {
            return response("Certificate not found", 500);
        }
        return response(file_get_contents($certPath), 200)
            ->header('Content-Type', 'text/plain');
    }

    public function sign(Request $request)
    {
        $data = (string) $request->input('data', '');
        $privateKey = file_get_contents(storage_path('keys/qz_private_key_pkcs8.pem')) ?: '';;
        if ($privateKey === '') {
            return response()->json(['error' => 'QZ private key not configured'], 500);
        }

        // QZ expects PKCS#8 RSA private key signing with SHA512
        $signature = '';
        $pkey = openssl_pkey_get_private($privateKey);
        if ($pkey === false) {
            return response()->json(['error' => 'Invalid QZ private key'], 500);
        }
        $ok = openssl_sign($data, $rawSig, $pkey, OPENSSL_ALGO_SHA512);

        if (!$ok) {
            return response()->json(['error' => 'Signing failed'], 500);
        }
        $signature = base64_encode($rawSig);
        return response()->json(['signature' => $signature]);
    }

    public function hash(Request $request)
    {
        $data = (string) $request->input('data', '');
        return Response::make(hash('sha512', $data));
    }

    /**
     * Return base64 of the Cairo-Regular TTF so we can inline the font into HTML sent to QZ Tray.
     */
    public function fontBase64()
    {
        $fontPath = public_path('fonts/static/Cairo-Regular.ttf');
        if (!file_exists($fontPath)) {
            return response('Font not found', 404);
        }
        $data = file_get_contents($fontPath);
        $b64 = base64_encode($data);
        return response($b64, 200)->header('Content-Type', 'text/plain');
    }
}
