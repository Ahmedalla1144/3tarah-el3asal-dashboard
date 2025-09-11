<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApPayment>
 */
class ApPaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'number' => $this->faker->unique()->bothify('PY-#####'),
            'supplier_id' => 1,
            'account_id' => 1,
            'payment_method_id' => 1,
            'amount' => $this->faker->randomFloat(2, 50, 1000),
            'paid_at' => $this->faker->dateTimeBetween('-7 days','now'),
            'reference_no' => $this->faker->optional()->bothify('REF-#####'),
            'notes' => null,
            'user_id' => null,
        ];
    }
}
