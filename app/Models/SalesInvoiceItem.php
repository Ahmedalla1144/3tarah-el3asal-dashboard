<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesInvoiceItem extends Model
{
    /** @use HasFactory<\Database\Factories\SalesInvoiceItemFactory> */
    use HasFactory;

    protected $fillable = [
        'sales_invoice_id',
        'product_id',
        'unit_id',
        'qty',
        'unit_price',
        'discount_value',
        'tax_value',
        'line_total',
        'qty_base'
    ];

    public function invoice()
    {
        return $this->belongsTo(SalesInvoice::class, 'sales_invoice_id');
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
