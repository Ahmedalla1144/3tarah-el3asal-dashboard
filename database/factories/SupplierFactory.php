<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'phone' => $this->faker->optional()->phoneNumber(),
            'address' => $this->faker->optional()->address(),
            'email' => $this->faker->optional()->companyEmail(),
            'tax_id' => $this->faker->optional()->bothify('VAT-#####'),
            'opening_balance' => 0,
            'notes' => null,
            'is_active' => true,
        ];
    }
}
