<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sequence>
 */
class SequenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement([
                'sales_invoice','purchase_invoice','sales_return','purchase_return',
                'ar_receipt','ap_payment'
            ]),
            'prefix' => strtoupper($this->faker->lexify('???')),
            'next_no' => 1,
            'padding' => 6,
        ];
    }
}
