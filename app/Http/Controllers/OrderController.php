<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Setting;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Add item to order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'menu_item_id' => 'required|exists:menu_items,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $order = Order::findOrFail($request->order_id);
        $menuItem = MenuItem::findOrFail($request->menu_item_id);

        // Check if item already exists in order
        $existingItem = OrderItem::where('order_id', $order->id)
            ->where('menu_item_id', $menuItem->id)
            ->first();

        if ($existingItem) {
            // Update existing item
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->quantity,
                'total' => ($existingItem->quantity + $request->quantity) * $menuItem->price,
                'notes' => $request->notes ?? $existingItem->notes,
            ]);
        } else {
            // Create new item
            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $menuItem->id,
                'quantity' => $request->quantity,
                'price' => $menuItem->price,
                'total' => $request->quantity * $menuItem->price,
                'notes' => $request->notes,
            ]);
        }

        $this->updateOrderTotals($order);

        return back()->with('success', 'Item added to order');
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $action = $request->input('action');

        switch ($action) {
            case 'send_to_kitchen':
                return $this->sendToKitchen($order);
            case 'cancel':
                return $this->cancelOrder($order);
            case 'move_table':
                return $this->moveToTable($request, $order);
            default:
                return back()->with('error', 'Invalid action');
        }
    }

    /**
     * Send order to kitchen.
     */
    protected function sendToKitchen(Order $order)
    {
        if ($order->items->isEmpty()) {
            return back()->with('error', 'Cannot send empty order to kitchen');
        }

        $order->update([
            'status' => 'sent_to_kitchen',
            'sent_to_kitchen_at' => now(),
        ]);

        return back()->with('success', 'Order sent to kitchen');
    }

    /**
     * Cancel order.
     */
    protected function cancelOrder(Order $order)
    {
        if ($order->status !== 'pending') {
            return back()->with('error', 'Only pending orders can be cancelled');
        }

        $order->update(['status' => 'cancelled']);
        $order->table->update(['is_available' => true]);

        return back()->with('success', 'Order cancelled');
    }

    /**
     * Move order to different table.
     */
    protected function moveToTable(Request $request, Order $order)
    {
        $request->validate([
            'table_id' => 'required|exists:tables,id',
        ]);

        $newTable = Table::findOrFail($request->table_id);
        
        if ($newTable->currentOrder && $newTable->currentOrder->id !== $order->id) {
            return back()->with('error', 'Target table already has an active order');
        }

        $oldTable = $order->table;
        
        $order->update(['table_id' => $newTable->id]);
        
        $oldTable->update(['is_available' => true]);
        $newTable->update(['is_available' => false]);

        return back()->with('success', "Order moved from {$oldTable->name} to {$newTable->name}");
    }

    /**
     * Update order totals.
     */
    protected function updateOrderTotals(Order $order)
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