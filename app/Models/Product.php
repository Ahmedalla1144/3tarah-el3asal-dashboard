<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'category_id',
        'sku',
        'barcode',
        'base_unit_id',
        'sale_price',
        'cost_price',
        'min_stock',
        'is_batch_tracked',
        'is_active'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function baseUnit()
    {
        return $this->belongsTo(Unit::class, 'base_unit_id');
    }
    public function units()
    {
        return $this->hasMany(ProductUnit::class);
    }

    public function stockBalances()
    {
        return $this->hasMany(StockBalance::class);
    }

    public function getStockAttribute(): float
    {
        if (array_key_exists('current_stock', $this->attributes)) {
            return (float) $this->attributes['current_stock'];
        }

        return (float) $this->stockBalances()->sum('qty_base');
    }
    /** Optional: stock for a specific warehouse */
    public function stockForWarehouse(int $warehouseId): float
    {
        return (float) $this->stockBalances()
            ->where('warehouse_id', $warehouseId)
            ->sum('qty_base');
    }

    /** Query scope to include per-product sum (optionally per-warehouse) */
    public function scopeWithCurrentStock($query, int $warehouseId = null)
    {
        return $query->withSum(
            ['stockBalances as current_stock' => function ($q) use ($warehouseId) {
                if ($warehouseId) {
                    $q->where('warehouse_id', $warehouseId);
                }
            }],
            'qty_base'
        );
    }
}
