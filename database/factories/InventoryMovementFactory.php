<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryMovement>
 */
class InventoryMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'warehouse_id' => 1,
            'product_id' => 1,
            'direction' => 'in',
            'qty_base' => 0.0,
            'unit_cost' => null,
            'reason' => 'adjustment',
            'sales_invoice_item_id' => null,
            'purchase_invoice_item_id' => null,
            'sales_return_item_id' => null,
            'purchase_return_item_id' => null,
            'adjustment_item_id' => null,
            'note' => null,
            'moved_at' => now(),
        ];
    }
}
