<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApPayment extends Model
{
    protected $fillable = [
        'number','supplier_id','account_id','payment_method_id','amount',
        'paid_at','reference_no','notes','user_id'
    ];

    public function supplier() { return $this->belongsTo(Supplier::class); }
    public function allocations() { return $this->hasMany(ApAllocation::class); }
}
