<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adjustment extends Model
{
    /** @use HasFactory<\Database\Factories\AdjustmentFactory> */
    use HasFactory;

    protected $fillable = ['warehouse_id', 'user_id', 'reason', 'status'];
    public function items()
    {
        return $this->hasMany(AdjustmentItem::class);
    }
}
