<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name','phone','address','email','tax_id','opening_balance','notes','is_active'
    ];

    public function purchaseInvoices() { return $this->hasMany(PurchaseInvoice::class); }
    public function payments() { return $this->hasMany(ApPayment::class); }
}
