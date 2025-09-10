<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseInvoiceItem extends Model
{
    protected $fillable = [
        'purchase_invoice_id','product_id','unit_id','qty','unit_cost',
        'discount_value','tax_value','line_total','qty_base'
    ];

    public function invoice() { return $this->belongsTo(PurchaseInvoice::class,'purchase_invoice_id'); }
    public function product() { return $this->belongsTo(Product::class); }
}
