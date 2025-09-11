<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockBalance extends Model
{
    /** @use HasFactory<\Database\Factories\StockBalanceFactory> */
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = null;
    public $incrementing = false;
    protected $fillable = ['warehouse_id', 'product_id', 'qty_base', 'updated_at'];
}
