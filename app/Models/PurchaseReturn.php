<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseReturn extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseReturnFactory> */
    use HasFactory;

    protected $fillable = [
        'number',
        'supplier_id',
        'warehouse_id',
        'date',
        'status',
        'subtotal',
        'discount_total',
        'tax_total',
        'total',
        'notes',
        'user_id'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
    public function items()
    {
        return $this->hasMany(PurchaseReturnItem::class);
    }
}
