<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'number' => $this->faker->unique()->bothify('S-#####'),
            'customer_id' => 1,
            'warehouse_id' => 1,
            'date' => $this->faker->date(),
            'due_date' => $this->faker->optional()->date(),
            'status' => 'open',
            'subtotal' => 0,
            'discount_total' => 0,
            'tax_total' => 0,
            'total' => 0,
            'notes' => null,
            'user_id' => null,
        ];
    }
}
