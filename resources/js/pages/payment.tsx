import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Order {
    id: number;
    order_number: string;
    subtotal: number;
    tax: number;
    total: number;
    table: {
        id: number;
        name: string;
    };
    items: OrderItem[];
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    total: number;
    notes: string;
    menu_item: {
        id: number;
        name: string;
    };
}



interface Props {
    order: Order;
    [key: string]: unknown;
}

export default function Payment({ order }: Props) {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'card'>('cash');
    const [paidAmount, setPaidAmount] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'cash' as 'cash' | 'qris' | 'card',
        paid_amount: '',
        notes: '',
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const calculateChange = () => {
        if (paymentMethod !== 'cash') return 0;
        const paid = parseFloat(paidAmount) || 0;
        return Math.max(0, paid - order.total);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('payment.store', order.id));
    };

    const quickAmounts = [
        order.total,
        Math.ceil(order.total / 50000) * 50000,
        Math.ceil(order.total / 100000) * 100000,
        Math.ceil(order.total / 200000) * 200000,
    ].filter((amount, index, arr) => arr.indexOf(amount) === index);

    return (
        <AppShell>
            <Head title={`Payment - ${order.order_number}`} />
            
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">💳 Payment</h1>
                    <p className="text-gray-600">Process payment for {order.table.name}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">📋 Order Summary</h2>
                        
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Order Number:</span>
                                <span>{order.order_number}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Table:</span>
                                <span>{order.table.name}</span>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4 border-t pt-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">{item.menu_item.name}</span>
                                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                        {item.notes && (
                                            <div className="text-sm text-gray-500 italic">Note: {item.notes}</div>
                                        )}
                                    </div>
                                    <span>{formatPrice(item.total)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax:</span>
                                <span>{formatPrice(order.tax)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl border-t pt-2">
                                <span>Total:</span>
                                <span className="text-green-600">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">💰 Payment Method</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Payment Method
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'cash', label: '💰 Cash', icon: '💰' },
                                        { value: 'qris', label: '📱 QRIS', icon: '📱' },
                                        { value: 'card', label: '💳 Card', icon: '💳' },
                                    ].map((method) => (
                                        <button
                                            key={method.value}
                                            type="button"
                                            className={`p-4 rounded-lg border-2 text-center transition-all ${
                                                paymentMethod === method.value
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onClick={() => {
                                                const methodValue = method.value as 'cash' | 'qris' | 'card';
                                                setPaymentMethod(methodValue);
                                                setData('payment_method', methodValue);
                                            }}
                                        >
                                            <div className="text-2xl mb-2">{method.icon}</div>
                                            <div className="text-sm font-medium">
                                                {method.label.replace(/^[^\s]+\s/, '')}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cash Payment Details */}
                            {paymentMethod === 'cash' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount Paid
                                        </label>
                                        <input
                                            type="number"
                                            value={paidAmount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setPaidAmount(value);
                                                setData('paid_amount', value);
                                            }}
                                            className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                                            placeholder="Enter amount"
                                            min={order.total}
                                            step="1000"
                                        />
                                        {errors.paid_amount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.paid_amount}</p>
                                        )}
                                    </div>

                                    {/* Quick Amount Buttons */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quick Select
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {quickAmounts.map((amount) => (
                                                <button
                                                    key={amount}
                                                    type="button"
                                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                                                    onClick={() => {
                                                        const amountStr = amount.toString();
                                                        setPaidAmount(amountStr);
                                                        setData('paid_amount', amountStr);
                                                    }}
                                                >
                                                    {formatPrice(amount)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Change Calculation */}
                                    {paidAmount && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-green-800">Change:</span>
                                                <span className="font-bold text-lg text-green-800">
                                                    {formatPrice(calculateChange())}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Non-cash payment amount */}
                            {paymentMethod !== 'cash' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-blue-800">Amount to Pay:</span>
                                        <span className="font-bold text-lg text-blue-800">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    rows={3}
                                    placeholder="Add any notes about the payment..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.get(route('cashier.index'))}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    disabled={processing || (paymentMethod === 'cash' && parseFloat(paidAmount) < order.total)}
                                >
                                    {processing ? 'Processing...' : 'Complete Payment'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}