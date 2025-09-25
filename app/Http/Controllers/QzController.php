<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class QzController extends Controller
{
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
        openssl_free_key($pkey);
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
}


