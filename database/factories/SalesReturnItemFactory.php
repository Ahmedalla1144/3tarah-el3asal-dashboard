<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SalesReturnItem>
 */
class SalesReturnItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sales_return_id' => 1,
            'product_id' => 1,
            'unit_id' => 1,
            'qty' => $this->faker->randomFloat(3, 0.1, 2),
            'unit_price' => $this->faker->randomFloat(2, 10, 200),
            'discount_value' => 0,
            'tax_value' => 0,
            'line_total' => 0,
            'original_sales_item_id' => null,
            'qty_base' => 0,
        ];
    }
}
