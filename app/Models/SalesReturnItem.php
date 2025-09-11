<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesReturnItem extends Model
{
    /** @use HasFactory<\Database\Factories\SalesReturnItemFactory> */
    use HasFactory;
    protected $fillable = [
        'sales_return_id',
        'product_id',
        'unit_id',
        'qty',
        'unit_price',
        'discount_value',
        'tax_value',
        'line_total',
        'original_sales_item_id',
        'qty_base'
    ];

    public function salesReturn()
    {
        return $this->belongsTo(SalesReturn::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
