<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryMovement extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryMovementFactory> */
    use HasFactory;

    protected $fillable = [
        'warehouse_id',
        'product_id',
        'direction',
        'qty_base',
        'unit_cost',
        'reason',
        'sales_invoice_item_id',
        'purchase_invoice_item_id',
        'sales_return_item_id',
        'purchase_return_item_id',
        'adjustment_item_id',
        'note',
        'moved_at'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
