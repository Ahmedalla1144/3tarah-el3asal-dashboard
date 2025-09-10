<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseInvoice extends Model
{
    protected $fillable = [
        'number','supplier_id','warehouse_id','date','due_date','status',
        'subtotal','discount_total','tax_total','total','notes','user_id'
    ];

    public function supplier() { return $this->belongsTo(Supplier::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
    public function items() { return $this->hasMany(PurchaseInvoiceItem::class); }
    public function allocations() { return $this->hasMany(ApAllocation::class); }
}
