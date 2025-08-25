<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Setting;
use App\Models\Table;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CashierController extends Controller
{
    /**
     * Display the main cashier interface.
     */
    public function index()
    {
        $tables = Table::with(['currentOrder.items.menuItem'])->get();
        $categories = Category::active()->with('menuItems')->orderBy('sort_order')->get();
        $settings = Setting::all()->pluck('value', 'key');

        return Inertia::render('cashier', [
            'tables' => $tables,
            'categories' => $categories,
            'settings' => $settings,
        ]);
    }

    /**
     * Create a new order for a table.
     */
    public function store(Request $request)
    {
        $request->validate([
            'table_id' => 'required|exists:tables,id',
        ]);

        $table = Table::findOrFail($request->table_id);
        
        // Check if table already has an active order
        $existingOrder = $table->currentOrder;
        if ($existingOrder) {
            return back()->with('error', 'Table already has an active order.');
        }

        $orderNumber = 'ORD-' . now()->format('Ymd') . '-' . str_pad((string)(Order::whereDate('created_at', now())->count() + 1), 4, '0', STR_PAD_LEFT);

        $order = Order::create([
            'order_number' => $orderNumber,
            'table_id' => $table->id,
            'user_id' => Auth::id(),
            'status' => 'pending',
            'subtotal' => 0,
            'tax' => 0,
            'total' => 0,
        ]);

        // Mark table as occupied
        $table->update(['is_available' => false]);

        return back()->with('success', 'New order created for ' . $table->name);
    }
}