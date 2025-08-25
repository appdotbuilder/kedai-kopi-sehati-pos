<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'ORD-' . now()->format('Ymd') . '-' . str_pad((string)$this->faker->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'table_id' => Table::factory(),
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'sent_to_kitchen', 'preparing', 'ready', 'served', 'paid']),
            'subtotal' => $subtotal = $this->faker->numberBetween(20000, 200000),
            'tax' => $tax = $subtotal * 0.1,
            'total' => $subtotal + $tax,
            'notes' => $this->faker->optional()->sentence(),
            'sent_to_kitchen_at' => $this->faker->optional()->dateTime(),
            'completed_at' => $this->faker->optional()->dateTime(),
        ];
    }

    /**
     * Indicate that the order is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'sent_to_kitchen_at' => null,
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the order is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'completed_at' => now(),
        ]);
    }
}