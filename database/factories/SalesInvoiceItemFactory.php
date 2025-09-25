<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\SalesInvoice;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SalesInvoiceItem>
 */
class SalesInvoiceItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        $unit    = $product->baseUnit ?? (Unit::inRandomOrder()->first() ?? Unit::factory()->create());

        $qty = $this->faker->randomFloat(2, 1, 20);
        $unitPrice = $this->faker->randomFloat(2, 10, 500);
        $discount = $this->faker->randomFloat(2, 0, 50);
        $tax = $this->faker->randomFloat(2, 0, 30);
        $lineTotal = ($qty * $unitPrice) - $discount + $tax;
        return [
            'sales_invoice_id' => SalesInvoice::get()->random()->id ?? SalesInvoice::factory(),
            'product_id' => $product->id,
            'unit_id' => $unit->id,
            'qty' => $qty,
            'unit_price' => $unitPrice,
            'discount_value' => $discount,
            'tax_value' => $tax,
            'line_total' => $lineTotal,
            'qty_base' => $qty,
        ];
    }
}
