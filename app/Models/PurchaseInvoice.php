<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseInvoice extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseInvoiceFactory> */
    use HasFactory;

    protected $fillable = [
        'number',
        'supplier_id',
        'warehouse_id',
        'date',
        'due_date',
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
        return $this->hasMany(PurchaseInvoiceItem::class);
    }
    public function allocations()
    {
        return $this->hasMany(ApAllocation::class);
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
