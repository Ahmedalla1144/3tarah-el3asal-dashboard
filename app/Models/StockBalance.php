<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockBalance extends Model
{
    /** @use HasFactory<\Database\Factories\StockBalanceFactory> */
    use HasFactory;

    protected $fillable = ['warehouse_id', 'product_id', 'qty_base'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
