<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Setting;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    /**
     * Update order item quantity.
     */
    public function update(Request $request, OrderItem $orderItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $orderItem->update([
            'quantity' => $request->quantity,
            'total' => $request->quantity * $orderItem->price,
            'notes' => $request->notes,
        ]);

        $this->updateOrderTotals($orderItem->order);

        return back()->with('success', 'Item updated');
    }

    /**
     * Remove item from order.
     */
    public function destroy(OrderItem $orderItem)
    {
        $order = $orderItem->order;
        $orderItem->delete();

        $this->updateOrderTotals($order);

        return back()->with('success', 'Item removed from order');
    }

    /**
     * Update order totals.
     */
    protected function updateOrderTotals($order)
    {
        $subtotal = $order->items->sum('total');
        $taxRate = Setting::getValue('tax_rate', 0.1);
        $tax = $subtotal * $taxRate;
        $total = $subtotal + $tax;

        $order->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
        ]);
    }
}