<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArAllocation>
 */
class ArAllocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ar_receipt_id' => 1,
            'sales_invoice_id' => 1,
            'amount' => $this->faker->randomFloat(2, 10, 300),
        ];
    }
}
