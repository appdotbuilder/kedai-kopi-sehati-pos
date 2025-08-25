<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportsController extends Controller
{
    /**
     * Display daily reports.
     */
    public function index(Request $request)
    {
        $date = $request->get('date', now()->format('Y-m-d'));
        $startDate = Carbon::parse($date)->startOfDay();
        $endDate = Carbon::parse($date)->endOfDay();

        $transactions = Transaction::with(['order.table', 'order.items.menuItem'])
            ->whereBetween('paid_at', [$startDate, $endDate])
            ->orderBy('paid_at', 'desc')
            ->get();

        $summary = [
            'total_sales' => $transactions->sum('amount'),
            'total_orders' => $transactions->count(),
            'cash_sales' => $transactions->where('payment_method', 'cash')->sum('amount'),
            'qris_sales' => $transactions->where('payment_method', 'qris')->sum('amount'),
            'card_sales' => $transactions->where('payment_method', 'card')->sum('amount'),
            'average_order' => $transactions->count() > 0 ? $transactions->avg('amount') : 0,
        ];

        // Popular items
        $popularItems = collect();
        foreach ($transactions as $transaction) {
            foreach ($transaction->order->items as $item) {
                $existing = $popularItems->where('id', $item->menu_item_id)->first();
                if ($existing) {
                    $existing['quantity'] += $item->quantity;
                    $existing['total'] += $item->total;
                } else {
                    $popularItems->push([
                        'id' => $item->menu_item_id,
                        'name' => $item->menuItem->name,
                        'quantity' => $item->quantity,
                        'total' => $item->total,
                    ]);
                }
            }
        }

        $popularItems = $popularItems->sortByDesc('quantity')->take(10)->values();

        return Inertia::render('reports', [
            'date' => $date,
            'summary' => $summary,
            'transactions' => $transactions,
            'popularItems' => $popularItems,
        ]);
    }
}