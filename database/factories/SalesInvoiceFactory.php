<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SalesInvoice>
 */
class SalesInvoiceFactory extends Factory
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
        $tax      = $this->faker->randomFloat(2, 0, 300);
        $total    = $subtotal - $discount + $tax;
        return [
            'number' => 'SI-' . $this->faker->unique()->numerify('######'),
            'customer_id' => Customer::get()->random()->id ?? Customer::factory(),
            'warehouse_id' => Warehouse::get()->random()->id ?? Warehouse::factory(),
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+3 months'),
            'status' => $this->faker->randomElement(['open', 'paid', 'cancelled']),
            'subtotal' => $subtotal,
            'discount_total' => $discount,
            'tax_total' => $tax,
            'total' => $total,
            'notes' => $this->faker->optional()->sentence(),
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'customer_balance_at_creation' => $this->faker->randomFloat(2, 0, 10000),
        ];
    }
    public function configure()
    {
        return $this->afterCreating(function (SalesInvoice $invoice) {
            SalesInvoiceItem::factory(rand(1, 5))->create([
                'sales_invoice_id' => $invoice->id,
            ]);

            $subtotal = $invoice->items()->sum(DB::raw('qty * unit_price'));
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
