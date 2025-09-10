<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArAllocation extends Model
{
    protected $fillable = ['ar_receipt_id','sales_invoice_id','amount'];

    public function receipt() { return $this->belongsTo(ArReceipt::class,'ar_receipt_id'); }
    public function salesInvoice() { return $this->belongsTo(SalesInvoice::class); }
}
