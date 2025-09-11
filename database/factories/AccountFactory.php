<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['خزنة رئيسية','بنك مصر','محفظة الكترونية']),
            'type' => $this->faker->randomElement(['cash','bank','wallet']),
            'is_active' => true,
        ];
    }
}
