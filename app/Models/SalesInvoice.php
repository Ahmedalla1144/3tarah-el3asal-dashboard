<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesInvoice extends Model
{
    /** @use HasFactory<\Database\Factories\SalesInvoiceFactory> */
    use HasFactory;
    protected $fillable = [
        'number',
        'customer_id',
        'warehouse_id',
        'date',
        'due_date',
        'status',
        'subtotal',
        'discount_total',
        'tax_total',
        'total',
        'customer_balance_at_creation',
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
        return $this->hasMany(SalesInvoiceItem::class);
    }
    public function allocations()
    {
        return $this->hasMany(ArAllocation::class);
    }

    protected $appends = ['paid_amount', 'remaining_amount'];

    public function getPaidAmountAttribute(): float
    {
        return (float) $this->allocations()->sum('amount');
    }

    public function getRemainingAmountAttribute(): float
    {
        $total = (float) ($this->total ?? 0);
        $paid = (float) $this->paid_amount;
        $remaining = $total - $paid;
        return $remaining < 0 ? 0.0 : round($remaining, 2);
    }
}
