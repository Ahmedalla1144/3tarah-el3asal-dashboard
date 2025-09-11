<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApAllocation>
 */
class ApAllocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ap_payment_id' => 1,
            'purchase_invoice_id' => 1,
            'amount' => $this->faker->randomFloat(2, 10, 300),
        ];
    }
}
