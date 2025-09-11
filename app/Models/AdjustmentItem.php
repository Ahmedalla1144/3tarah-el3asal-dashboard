<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdjustmentItem extends Model
{
    /** @use HasFactory<\Database\Factories\AdjustmentItemFactory> */
    use HasFactory;

    protected $fillable = ['adjustment_id', 'product_id', 'unit_id', 'qty_delta', 'qty_base', 'note'];

    public function adjustment()
    {
        return $this->belongsTo(Adjustment::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
