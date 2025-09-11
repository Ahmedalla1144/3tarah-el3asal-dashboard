<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement(['كمون','كركم','فلفل أسود','ينسون','شمر','زنجبيل','قرفة']),
            'category_id' => null,
            'sku' => $this->faker->optional()->bothify('SKU-#####'),
            'barcode' => $this->faker->optional()->ean13(),
            'base_unit_id' => 1,
            'sale_price' => $this->faker->randomFloat(2, 10, 300),
            'cost_price' => $this->faker->randomFloat(2, 5, 200),
            'min_stock' => $this->faker->randomFloat(3, 0, 2000),
            'is_batch_tracked' => false,
            'is_active' => true,
        ];
    }
}
