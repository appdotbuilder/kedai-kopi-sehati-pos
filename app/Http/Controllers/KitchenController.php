<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    /**
     * Display the kitchen interface.
     */
    public function index()
    {
        $orders = Order::with(['table', 'items.menuItem.category', 'user'])
            ->whereIn('status', ['sent_to_kitchen', 'preparing'])
            ->orderBy('sent_to_kitchen_at')
            ->get();

        $settings = Setting::all()->pluck('value', 'key');

        return Inertia::render('kitchen', [
            'orders' => $orders,
            'settings' => $settings,
        ]);
    }

    /**
     * Update order status.
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:preparing,ready,served',
        ]);

        $order->update([
            'status' => $request->status,
            'completed_at' => $request->status === 'ready' ? now() : $order->completed_at,
        ]);

        $statusMessage = match($request->status) {
            'preparing' => 'Order is now being prepared',
            'ready' => 'Order is ready for pickup',
            'served' => 'Order has been served',
            default => 'Status updated',
        };

        return back()->with('success', $statusMessage);
    }
}