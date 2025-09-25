<?php

namespace Database\Factories;

use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceItem;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseInvoice>
 */
class PurchaseInvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 100, 5000);
        $discount = $this->faker->randomFloat(2, 0, 200);
        $tax = $this->faker->randomFloat(2, 0, 300);
        $total = $subtotal - $discount + $tax;

        return [
            'number' => 'PI-' . $this->faker->unique()->numerify('######'),
            'supplier_id' => Supplier::get()->random()->id ?? Supplier::factory(),
            'warehouse_id' => Warehouse::get()->random()->id ?? Warehouse::factory(),
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+3 months'),
            'status' => $this->faker->randomElement(['open', 'paid', 'cancelled']),
            'subtotal' => $subtotal,
            'discount_total' => $discount,
            'tax_total' => $tax,
            'total' => $total,
            'notes' => $this->faker->optional()->sentence(),
            'user_id' => User::get()->random()->id ?? User::factory(),
        ];
    }
    public function configure()
    {
        return $this->afterCreating(function (PurchaseInvoice $invoice) {
            PurchaseInvoiceItem::factory(rand(1, 5))->create([
                'purchase_invoice_id' => $invoice->id,
            ]);

            $subtotal = $invoice->items()->sum(DB::raw('qty * unit_cost'));
            $discount = $invoice->items()->sum('discount_value');
            $tax = $invoice->items()->sum('tax_value');
            $total = $invoice->items()->sum('line_total');

            $invoice->update([
                'subtotal' => $subtotal,
                'discount_total' => $discount,
                'tax_total' => $tax,
                'total' => $total,
            ]);
        });
    }
}
