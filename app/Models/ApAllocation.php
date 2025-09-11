<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApAllocation extends Model
{
    /** @use HasFactory<\Database\Factories\ApAllocationFactory> */
    use HasFactory;

    protected $fillable = ['ap_payment_id', 'purchase_invoice_id', 'amount'];

    public function payment()
    {
        return $this->belongsTo(ApPayment::class);
    }
    public function purchaseInvoice()
    {
        return $this->belongsTo(PurchaseInvoice::class);
    }
}
