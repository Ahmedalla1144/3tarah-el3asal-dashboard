<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name','category_id','sku','barcode','base_unit_id',
        'sale_price','cost_price','min_stock','is_batch_tracked','is_active'
    ];

    public function category() { return $this->belongsTo(Category::class); }
    public function baseUnit() { return $this->belongsTo(Unit::class,'base_unit_id'); }
    public function units() { return $this->hasMany(ProductUnit::class); }
}
