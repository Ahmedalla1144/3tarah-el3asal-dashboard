<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseInvoiceItem>
 */
class PurchaseInvoiceItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'purchase_invoice_id' => 1,
            'product_id' => 1,
            'unit_id' => 1,
            'qty' => $this->faker->randomFloat(3, 0.5, 20),
            'unit_cost' => $this->faker->randomFloat(2, 5, 150),
            'discount_value' => 0,
            'tax_value' => 0,
            'line_total' => 0,
            'qty_base' => 0,
        ];
    }
}
