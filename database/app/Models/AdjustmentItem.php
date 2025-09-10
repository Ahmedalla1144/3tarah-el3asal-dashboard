<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdjustmentItem extends Model
{
    protected $fillable = ['adjustment_id','product_id','unit_id','qty_delta','qty_base','note'];

    public function adjustment() { return $this->belongsTo(Adjustment::class); }
    public function product() { return $this->belongsTo(Product::class); }
}
