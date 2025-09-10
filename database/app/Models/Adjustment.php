<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Adjustment extends Model
{
    protected $fillable = ['warehouse_id','user_id','reason','status'];

    public function items() { return $this->hasMany(AdjustmentItem::class); }
}
