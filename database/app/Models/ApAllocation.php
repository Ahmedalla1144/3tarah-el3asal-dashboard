<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApAllocation extends Model
{
    protected $fillable = ['ap_payment_id','purchase_invoice_id','amount'];

    public function payment() { return $this->belongsTo(ApPayment::class,'ap_payment_id'); }
    public function purchaseInvoice() { return $this->belongsTo(PurchaseInvoice::class); }
}
