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

    /**
     * Calculate customer's current debit balance
     * Opening balance + Total sales invoices - Total receipts
     */
    public function getCurrentBalanceAttribute(): float
    {
        $openingBalance = (float) ($this->opening_balance ?? 0);
        $totalSales = (float) $this->salesInvoices()->sum('total');
        $totalReceipts = (float) $this->receipts()->sum('amount');
        
        return round($openingBalance + $totalSales - $totalReceipts, 2);
    }

    protected $appends = ['current_balance'];
}
