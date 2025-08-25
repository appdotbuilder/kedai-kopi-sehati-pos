import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Transaction {
    id: number;
    transaction_number: string;
    payment_method: string;
    amount: number;
    paid_amount: number;
    change_amount: number;
    paid_at: string;
    order: {
        id: number;
        order_number: string;
        table: {
            name: string;
        };
        items: OrderItem[];
    };
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    total: number;
    notes: string;
    menu_item: {
        name: string;
    };
}

interface Props {
    transaction: Transaction;
    [key: string]: unknown;
}

export default function Receipt({ transaction }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <html>
                <head>
                    <title>Receipt - ${transaction.transaction_number}</title>
                    <style>
                        body { font-family: monospace; margin: 20px; font-size: 12px; line-height: 1.4; }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
                        .info { margin-bottom: 15px; }
                        .items { margin-bottom: 15px; }
                        .item { display: flex; justify-content: space-between; margin-bottom: 3px; }
                        .totals { border-top: 1px solid #000; padding-top: 10px; }
                        .total-line { display: flex; justify-content: space-between; margin-bottom: 3px; }
                        .final-total { border-top: 1px solid #000; padding-top: 5px; margin-top: 5px; font-weight: bold; }
                        .footer { text-align: center; margin-top: 20px; border-top: 2px solid #000; padding-top: 10px; }
                        .logo { font-size: 24px; margin-bottom: 5px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">☕</div>
                        <h2>KEDAI KOPI SEHATI</h2>
                        <p>RECEIPT</p>
                    </div>
                    
                    <div class="info">
                        <div><strong>Transaction:</strong> ${transaction.transaction_number}</div>
                        <div><strong>Order:</strong> ${transaction.order.order_number}</div>
                        <div><strong>Table:</strong> ${transaction.order.table.name}</div>
                        <div><strong>Date:</strong> ${new Date(transaction.paid_at).toLocaleString()}</div>
                        <div><strong>Payment:</strong> ${transaction.payment_method.toUpperCase()}</div>
                    </div>
                    
                    <div class="items">
                        <div style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 10px;">
                            <strong>ITEMS</strong>
                        </div>
                        ${transaction.order.items.map(item => `
                            <div class="item">
                                <span>${item.quantity}x ${item.menu_item.name}</span>
                                <span>${formatPrice(item.total)}</span>
                            </div>
                            ${item.notes ? `<div style="font-style: italic; font-size: 10px; margin-left: 20px; color: #666;">Note: ${item.notes}</div>` : ''}
                        `).join('')}
                    </div>
                    
                    <div class="totals">
                        <div class="total-line">
                            <span>Subtotal:</span>
                            <span>${formatPrice(transaction.order.items.reduce((sum, item) => sum + item.total, 0))}</span>
                        </div>
                        <div class="total-line">
                            <span>Tax (10%):</span>
                            <span>${formatPrice(transaction.amount - transaction.order.items.reduce((sum, item) => sum + item.total, 0))}</span>
                        </div>
                        <div class="total-line final-total">
                            <span>TOTAL:</span>
                            <span>${formatPrice(transaction.amount)}</span>
                        </div>
                        ${transaction.payment_method === 'cash' ? `
                            <div class="total-line">
                                <span>Paid:</span>
                                <span>${formatPrice(transaction.paid_amount)}</span>
                            </div>
                            <div class="total-line">
                                <span>Change:</span>
                                <span>${formatPrice(transaction.change_amount)}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="footer">
                        <p>Terima kasih telah berkunjung!</p>
                        <p>Sampai jumpa lagi.</p>
                        <p style="margin-top: 10px; font-size: 10px;">☕ Kedai Kopi SEHATI ☕</p>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash': return '💰';
            case 'qris': return '📱';
            case 'card': return '💳';
            default: return '💳';
        }
    };

    return (
        <AppShell>
            <Head title={`Receipt - ${transaction.transaction_number}`} />
            
            <div className="container mx-auto p-6 max-w-2xl">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-green-600 text-white p-6 text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <h1 className="text-2xl font-bold">Payment Successful!</h1>
                        <p className="opacity-90">Transaction completed successfully</p>
                    </div>

                    {/* Receipt Content */}
                    <div className="p-6">
                        {/* Transaction Info */}
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-2">☕</div>
                            <h2 className="text-xl font-bold text-gray-800">Kedai Kopi SEHATI</h2>
                            <p className="text-gray-600">Official Receipt</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <span className="text-gray-600">Transaction:</span>
                                <div className="font-medium">{transaction.transaction_number}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Order:</span>
                                <div className="font-medium">{transaction.order.order_number}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Table:</span>
                                <div className="font-medium">{transaction.order.table.name}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Payment:</span>
                                <div className="font-medium flex items-center gap-1">
                                    {getPaymentMethodIcon(transaction.payment_method)}
                                    {transaction.payment_method.toUpperCase()}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-600">Date & Time:</span>
                                <div className="font-medium">
                                    {new Date(transaction.paid_at).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b">Items Ordered</h3>
                            <div className="space-y-2">
                                {transaction.order.items.map((item) => (
                                    <div key={item.id}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-medium">{item.menu_item.name}</span>
                                                <span className="text-gray-600 ml-2">×{item.quantity}</span>
                                            </div>
                                            <span className="font-medium">{formatPrice(item.total)}</span>
                                        </div>
                                        {item.notes && (
                                            <div className="text-sm text-gray-500 italic ml-4">
                                                Note: {item.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>{formatPrice(transaction.order.items.reduce((sum, item) => sum + item.total, 0))}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax (10%):</span>
                                <span>{formatPrice(transaction.amount - transaction.order.items.reduce((sum, item) => sum + item.total, 0))}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span className="text-green-600">{formatPrice(transaction.amount)}</span>
                            </div>
                            
                            {transaction.payment_method === 'cash' && (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span>Amount Paid:</span>
                                        <span>{formatPrice(transaction.paid_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Change:</span>
                                        <span className="text-blue-600 font-medium">{formatPrice(transaction.change_amount)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Message */}
                        <div className="text-center mt-6 pt-6 border-t text-gray-600">
                            <p className="mb-1">Terima kasih telah berkunjung!</p>
                            <p>Sampai jumpa lagi.</p>
                            <div className="text-2xl mt-3">☕</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 p-6 flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handlePrint}
                        >
                            🖨️ Print Receipt
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={() => router.get(route('cashier.index'))}
                        >
                            🛒 New Order
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.get(route('reports.index'))}
                        >
                            📊 View Reports
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}