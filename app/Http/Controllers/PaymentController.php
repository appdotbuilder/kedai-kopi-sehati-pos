<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Show payment form.
     */
    public function create(Order $order)
    {
        $order->load(['table', 'items.menuItem']);

        return Inertia::render('payment', [
            'order' => $order,
        ]);
    }

    /**
     * Process payment.
     */
    public function store(Request $request, Order $order)
    {
        $request->validate([
            'payment_method' => 'required|in:cash,qris,card',
            'paid_amount' => 'required|numeric|min:0',
        ]);

        if ($request->payment_method === 'cash' && $request->paid_amount < $order->total) {
            return back()->with('error', 'Paid amount cannot be less than total amount');
        }

        $changeAmount = $request->payment_method === 'cash' 
            ? max(0, $request->paid_amount - $order->total)
            : 0;

        $transactionNumber = 'TXN-' . now()->format('Ymd') . '-' . str_pad((string)(Transaction::whereDate('created_at', now())->count() + 1), 4, '0', STR_PAD_LEFT);

        $transaction = Transaction::create([
            'transaction_number' => $transactionNumber,
            'order_id' => $order->id,
            'payment_method' => $request->payment_method,
            'amount' => $order->total,
            'paid_amount' => $request->paid_amount,
            'change_amount' => $changeAmount,
            'notes' => $request->notes,
            'paid_at' => now(),
        ]);

        $order->update([
            'status' => 'paid',
            'completed_at' => now(),
        ]);

        $order->table->update(['is_available' => true]);

        return Inertia::render('receipt', [
            'transaction' => $transaction->load(['order.table', 'order.items.menuItem']),
        ]);
    }
}