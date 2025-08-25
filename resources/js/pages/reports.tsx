import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Transaction {
    id: number;
    transaction_number: string;
    payment_method: string;
    amount: number;
    paid_at: string;
    order: {
        order_number: string;
        table: {
            name: string;
        };
    };
}

interface PopularItem {
    id: number;
    name: string;
    quantity: number;
    total: number;
}

interface Summary {
    total_sales: number;
    total_orders: number;
    cash_sales: number;
    qris_sales: number;
    card_sales: number;
    average_order: number;
}

interface Props {
    date: string;
    summary: Summary;
    transactions: Transaction[];
    popularItems: PopularItem[];
    [key: string]: unknown;
}

export default function Reports({ date, summary, transactions, popularItems }: Props) {
    const [selectedDate, setSelectedDate] = useState(date);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleDateChange = (newDate: string) => {
        setSelectedDate(newDate);
        router.get(route('reports.index'), { date: newDate }, {
            preserveState: true,
            replace: true,
        });
    };

    const exportToPrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <html>
                <head>
                    <title>Daily Report - ${date}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                        .summary { margin-bottom: 20px; }
                        .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
                        .summary-item { border: 1px solid #ccc; padding: 10px; }
                        .transactions { margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background-color: #f0f0f0; }
                        .popular-items { margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>☕ Kedai Kopi SEHATI</h1>
                        <h2>Daily Sales Report</h2>
                        <h3>${new Date(date).toLocaleDateString()}</h3>
                    </div>
                    
                    <div class="summary">
                        <h3>Summary</h3>
                        <div class="summary-grid">
                            <div class="summary-item">
                                <strong>Total Sales:</strong><br>
                                ${formatPrice(summary.total_sales)}
                            </div>
                            <div class="summary-item">
                                <strong>Total Orders:</strong><br>
                                ${summary.total_orders}
                            </div>
                            <div class="summary-item">
                                <strong>Cash Sales:</strong><br>
                                ${formatPrice(summary.cash_sales)}
                            </div>
                            <div class="summary-item">
                                <strong>QRIS Sales:</strong><br>
                                ${formatPrice(summary.qris_sales)}
                            </div>
                            <div class="summary-item">
                                <strong>Card Sales:</strong><br>
                                ${formatPrice(summary.card_sales)}
                            </div>
                            <div class="summary-item">
                                <strong>Average Order:</strong><br>
                                ${formatPrice(summary.average_order)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="transactions">
                        <h3>Transactions</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Transaction</th>
                                    <th>Table</th>
                                    <th>Payment</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions.map(transaction => `
                                    <tr>
                                        <td>${new Date(transaction.paid_at).toLocaleTimeString()}</td>
                                        <td>${transaction.transaction_number}</td>
                                        <td>${transaction.order.table.name}</td>
                                        <td>${transaction.payment_method.toUpperCase()}</td>
                                        <td>${formatPrice(transaction.amount)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="popular-items">
                        <h3>Popular Items</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity Sold</th>
                                    <th>Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${popularItems.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}</td>
                                        <td>${formatPrice(item.total)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <AppShell>
            <Head title="Sales Reports" />
            
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Sales Reports</h1>
                            <p className="text-gray-600">Daily transaction summary and analytics</p>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <Button onClick={exportToPrint} variant="outline">
                                🖨️ Print Report
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Total Sales</p>
                                <p className="text-2xl font-bold text-green-800">{formatPrice(summary.total_sales)}</p>
                            </div>
                            <div className="text-3xl">💰</div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                                <p className="text-2xl font-bold text-blue-800">{summary.total_orders}</p>
                            </div>
                            <div className="text-3xl">📋</div>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Average Order</p>
                                <p className="text-2xl font-bold text-purple-800">{formatPrice(summary.average_order)}</p>
                            </div>
                            <div className="text-3xl">📈</div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Breakdown */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">💳 Payment Methods</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-2xl mb-2">💰</div>
                            <h3 className="font-semibold">Cash</h3>
                            <p className="text-lg font-bold text-yellow-700">{formatPrice(summary.cash_sales)}</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-2xl mb-2">📱</div>
                            <h3 className="font-semibold">QRIS</h3>
                            <p className="text-lg font-bold text-blue-700">{formatPrice(summary.qris_sales)}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="text-2xl mb-2">💳</div>
                            <h3 className="font-semibold">Card</h3>
                            <p className="text-lg font-bold text-gray-700">{formatPrice(summary.card_sales)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Popular Items */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">🔥 Popular Items</h2>
                        {popularItems.length > 0 ? (
                            <div className="space-y-3">
                                {popularItems.slice(0, 10).map((item, index) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-orange-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{item.quantity} sold</div>
                                            <div className="text-sm text-gray-600">{formatPrice(item.total)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No sales data for this date</p>
                        )}
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">💳 Recent Transactions</h2>
                        {transactions.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {transactions.slice(0, 20).map((transaction) => (
                                    <div key={transaction.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                                        <div>
                                            <div className="font-medium">{transaction.transaction_number}</div>
                                            <div className="text-sm text-gray-600">
                                                {transaction.order.table.name} • {transaction.payment_method.toUpperCase()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(transaction.paid_at).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="font-semibold text-green-600">
                                            {formatPrice(transaction.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No transactions for this date</p>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}