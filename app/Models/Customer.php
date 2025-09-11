<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'address',
        'email',
        'tax_id',
        'opening_balance',
        'credit_limit',
        'notes',
        'is_active'
    ];

    public function salesInvoices()
    {
        return $this->hasMany(SalesInvoice::class);
    }
    public function receipts()
    {
        return $this->hasMany(ArReceipt::class);
    }
}
