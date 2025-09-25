<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Unit;
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
            // 'name' => $this->faker->unique()->randomElement(['كمون','كركم','فلفل أسود','ينسون','شمر','زنجبيل','قرفة']),
            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),
            'base_unit_id' => Unit::inRandomOrder()->first()->id ?? Unit::factory(),
            'sale_price' => $this->faker->randomFloat(2, 10, 5000),
            'cost_price' => $this->faker->randomFloat(2, 5, 4000),
            'sku' => $this->faker->unique()->ean8(),
            // 'sku' => $this->faker->optional()->bothify('SKU-#####'),
            'barcode' => $this->faker->ean13(),
            // 'barcode' => $this->faker->optional()->ean13(),
            'min_stock' => $this->faker->randomFloat(3, 0, 2000),
            'is_batch_tracked' => false,
            'is_active' => true,


            'name' => $this->faker->word(),
        ];
    }
}
