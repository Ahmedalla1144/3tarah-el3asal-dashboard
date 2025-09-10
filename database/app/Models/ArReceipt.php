<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArReceipt extends Model
{
    protected $fillable = [
        'number','customer_id','account_id','payment_method_id','amount',
        'received_at','reference_no','notes','user_id'
    ];

    public function customer() { return $this->belongsTo(Customer::class); }
    public function allocations() { return $this->hasMany(ArAllocation::class); }
}
