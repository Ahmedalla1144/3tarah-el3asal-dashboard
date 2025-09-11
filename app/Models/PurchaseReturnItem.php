<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseReturnItem extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseReturnItemFactory> */
    use HasFactory;
    protected $fillable = [
        'purchase_return_id',
        'product_id',
        'unit_id',
        'qty',
        'unit_cost',
        'discount_value',
        'tax_value',
        'line_total',
        'original_purchase_item_id',
        'qty_base'
    ];

    public function purchaseReturn()
    {
        return $this->belongsTo(PurchaseReturn::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
