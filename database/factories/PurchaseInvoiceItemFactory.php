<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\PurchaseInvoice;
use App\Models\Unit;
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
        $product = Product::get()->random() ?? Product::factory()->create();
        $unit = $product->baseUnit ?? (Unit::inRandomOrder()->first() ?? Unit::factory()->create());

        $qty = $this->faker->randomFloat(2, 1, 100);
        $unitCost = $this->faker->randomFloat(2, 5, 300);
        $discount = $this->faker->randomFloat(2, 0, 40);
        $tax = $this->faker->randomFloat(2, 0, 20);
        $lineTotal = ($qty * $unitCost) - $discount + $tax;

        return [
            'purchase_invoice_id' => PurchaseInvoice::get()->random()->id ?? PurchaseInvoice::factory(),
            'product_id' => $product->id,
            'unit_id' => $unit->id,
            'qty' => $qty,
            'unit_cost' => $unitCost,
            'discount_value' => $discount,
            'tax_value' => $tax,
            'line_total' => $lineTotal,
            'qty_base' => $qty,
        ];
    }
}
