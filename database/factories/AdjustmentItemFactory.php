<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdjustmentItem>
 */
class AdjustmentItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'adjustment_id' => 1,
            'product_id' => 1,
            'unit_id' => 1,
            'qty_delta' => 0.0,
            'qty_base' => 0.0,
            'note' => null,
        ];
    }
}
