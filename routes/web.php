<?php

use App\Http\Controllers\CashierController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\TableController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Cashier routes
    Route::get('/cashier', [CashierController::class, 'index'])->name('cashier.index');
    Route::post('/cashier', [CashierController::class, 'store'])->name('cashier.store');

    // Order routes
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::patch('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    
    // Order item routes
    Route::patch('/order-items/{orderItem}', [OrderItemController::class, 'update'])->name('order-items.update');
    Route::delete('/order-items/{orderItem}', [OrderItemController::class, 'destroy'])->name('order-items.destroy');

    // Kitchen routes
    Route::get('/kitchen', [KitchenController::class, 'index'])->name('kitchen.index');
    Route::patch('/kitchen/orders/{order}', [KitchenController::class, 'update'])->name('kitchen.update');

    // Payment routes
    Route::get('/payment/{order}', [PaymentController::class, 'create'])->name('payment.create');
    Route::post('/payment/{order}', [PaymentController::class, 'store'])->name('payment.store');

    // Reports routes
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');

    // Table management routes
    Route::resource('tables', TableController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
