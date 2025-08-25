<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $order = Order::factory()->create();
        $amount = $order->total;
        $paymentMethod = $this->faker->randomElement(['cash', 'qris', 'card']);
        
        $paidAmount = $paymentMethod === 'cash' 
            ? $this->faker->numberBetween($amount, $amount + 50000)
            : $amount;
        
        $changeAmount = $paymentMethod === 'cash' ? $paidAmount - $amount : 0;

        return [
            'transaction_number' => 'TXN-' . now()->format('Ymd') . '-' . str_pad((string)$this->faker->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'order_id' => $order->id,
            'payment_method' => $paymentMethod,
            'amount' => $amount,
            'paid_amount' => $paidAmount,
            'change_amount' => $changeAmount,
            'notes' => $this->faker->optional()->sentence(),
            'paid_at' => now(),
        ];
    }

    /**
     * Indicate that the payment is cash.
     */
    public function cash(): static
    {
        return $this->state(function (array $attributes) {
            $paidAmount = $this->faker->numberBetween($attributes['amount'], $attributes['amount'] + 50000);
            return [
                'payment_method' => 'cash',
                'paid_amount' => $paidAmount,
                'change_amount' => $paidAmount - $attributes['amount'],
            ];
        });
    }

    /**
     * Indicate that the payment is QRIS.
     */
    public function qris(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'qris',
            'paid_amount' => $attributes['amount'],
            'change_amount' => 0,
        ]);
    }
}