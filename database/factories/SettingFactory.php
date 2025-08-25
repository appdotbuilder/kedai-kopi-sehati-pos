<?php

namespace Database\Factories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Setting>
 */
class SettingFactory extends Factory
{
    protected $model = Setting::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $key = $this->faker->unique()->word();
        $type = $this->faker->randomElement(['string', 'boolean', 'integer', 'float', 'json']);
        
        $value = match ($type) {
            'boolean' => $this->faker->boolean() ? '1' : '0',
            'integer' => (string) $this->faker->numberBetween(1, 100),
            'float' => (string) $this->faker->randomFloat(2, 0, 100),
            'json' => json_encode(['key' => $this->faker->word()]),
            default => $this->faker->sentence(),
        };

        return [
            'key' => $key,
            'value' => $value,
            'type' => $type,
            'description' => $this->faker->sentence(),
        ];
    }
}