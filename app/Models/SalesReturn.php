<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesReturn extends Model
{
    /** @use HasFactory<\Database\Factories\SalesReturnFactory> */
    use HasFactory;

    protected $fillable = [
        'number',
        'customer_id',
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

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
    public function items()
    {
        return $this->hasMany(SalesReturnItem::class);
    }
}
