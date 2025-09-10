<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesInvoice extends Model
{
    protected $fillable = [
        'number','customer_id','warehouse_id','date','due_date','status',
        'subtotal','discount_total','tax_total','total','notes','user_id'
    ];

    public function customer() { return $this->belongsTo(Customer::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
    public function items() { return $this->hasMany(SalesInvoiceItem::class); }
    public function allocations() { return $this->hasMany(ArAllocation::class); }
}
