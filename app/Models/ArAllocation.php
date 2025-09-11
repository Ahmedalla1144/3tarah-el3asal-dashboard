<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArAllocation extends Model
{
    /** @use HasFactory<\Database\Factories\ArAllocationFactory> */
    use HasFactory;
    protected $fillable = ['ar_receipt_id', 'sales_invoice_id', 'amount'];

    public function receipt()
    {
        return $this->belongsTo(ArReceipt::class);
    }
    public function salesInvoice()
    {
        return $this->belongsTo(SalesInvoice::class);
    }
}
