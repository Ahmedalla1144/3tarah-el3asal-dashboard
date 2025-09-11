<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    /** @use HasFactory<\Database\Factories\WarehouseFactory> */
    use HasFactory;

    protected $fillable = ['name', 'code', 'address', 'location', 'notes', 'is_active'];

    public function stockBalances()
    {
        return $this->hasMany(StockBalance::class);
    }
}
