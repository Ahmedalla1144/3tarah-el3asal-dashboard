<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->optional()->phoneNumber(),
            'address' => $this->faker->optional()->address(),
            'email' => $this->faker->optional()->safeEmail(),
            'tax_id' => $this->faker->optional()->bothify('TAX-####'),
            'opening_balance' => 0,
            'credit_limit' => $this->faker->numberBetween(0, 5000),
            'notes' => null,
            'is_active' => true,
        ];
    }
}
