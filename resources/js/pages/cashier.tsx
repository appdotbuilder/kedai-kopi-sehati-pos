import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Table {
    id: number;
    number: string;
    name: string;
    capacity: number;
    is_available: boolean;
    current_order?: Order;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    menu_items: MenuItem[];
}

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    is_available: boolean;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    tax: number;
    total: number;
    items: OrderItem[];
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    total: number;
    notes: string;
    menu_item: MenuItem;
}

interface Props {
    tables: Table[];
    categories: Category[];
    settings: Record<string, string>;
    [key: string]: unknown;
}

export default function Cashier({ tables, categories, settings }: Props) {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        categories.length > 0 ? categories[0] : null
    );

    const handleCreateOrder = (table: Table) => {
        router.post(route('cashier.store'), {
            table_id: table.id,
        }, {
            preserveState: true,
            onSuccess: () => {
                // Order created successfully
            }
        });
    };

    const handleAddToOrder = (menuItem: MenuItem, quantity: number = 1) => {
        if (!selectedTable?.current_order) return;

        router.post(route('orders.store'), {
            order_id: selectedTable.current_order.id,
            menu_item_id: menuItem.id,
            quantity,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSendToKitchen = () => {
        if (!selectedTable?.current_order) return;

        router.patch(route('orders.update', selectedTable.current_order.id), {
            action: 'send_to_kitchen'
        }, {
            preserveState: true,
            onSuccess: () => {
                setSelectedTable(null);
            }
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AppShell>
            <Head title="Cashier System" />
            
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">☕ {settings.cafe_name || 'Cashier System'}</h1>
                    <p className="text-gray-600">Manage tables and take orders</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Tables Grid */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">🪑 Tables</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {tables.map((table) => (
                                    <div
                                        key={table.id}
                                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedTable?.id === table.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : table.is_available
                                                ? 'border-green-300 hover:border-green-400 bg-green-50'
                                                : 'border-red-300 bg-red-50'
                                        }`}
                                        onClick={() => setSelectedTable(table)}
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl mb-2">
                                                {table.is_available ? '🟢' : '🔴'}
                                            </div>
                                            <div className="font-semibold">{table.name}</div>
                                            <div className="text-sm text-gray-600">
                                                Capacity: {table.capacity}
                                            </div>
                                            {table.current_order && (
                                                <div className="text-xs bg-yellow-100 rounded px-2 py-1 mt-2">
                                                    Order: {table.current_order.order_number}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {table.is_available && !table.current_order && (
                                            <Button
                                                size="sm"
                                                className="w-full mt-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCreateOrder(table);
                                                }}
                                            >
                                                New Order
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Menu and Order */}
                    <div className="lg:col-span-7">
                        {selectedTable ? (
                            <div className="space-y-6">
                                {/* Order Summary */}
                                {selectedTable.current_order && (
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">
                                                📋 Order for {selectedTable.name}
                                            </h3>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.get(route('payment.create', selectedTable.current_order!.id))}
                                                >
                                                    💳 Pay
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleSendToKitchen}
                                                    className="bg-orange-600 hover:bg-orange-700"
                                                >
                                                    👨‍🍳 Send to Kitchen
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {selectedTable.current_order.items?.length > 0 ? (
                                                selectedTable.current_order.items.map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                                        <div>
                                                            <span className="font-medium">{item.menu_item.name}</span>
                                                            <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                                        </div>
                                                        <span className="font-medium">{formatPrice(item.total)}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">No items in order</p>
                                            )}
                                        </div>

                                        {selectedTable.current_order.items?.length > 0 && (
                                            <div className="border-t pt-4">
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Subtotal:</span>
                                                    <span>{formatPrice(selectedTable.current_order.subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Tax:</span>
                                                    <span>{formatPrice(selectedTable.current_order.tax)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-lg">
                                                    <span>Total:</span>
                                                    <span>{formatPrice(selectedTable.current_order.total)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Menu */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold mb-4">🍔 Menu</h3>
                                    
                                    {/* Category Tabs */}
                                    <div className="flex gap-2 mb-4">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    selectedCategory?.id === category.id
                                                        ? 'bg-amber-600 text-white'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Menu Items */}
                                    {selectedCategory && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedCategory.menu_items.filter(item => item.is_available).map((item) => (
                                                <div key={item.id} className="border rounded-lg p-4">
                                                    <h4 className="font-semibold">{item.name}</h4>
                                                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-amber-600">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAddToOrder(item)}
                                                            disabled={!selectedTable.current_order}
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <div className="text-6xl mb-4">🪑</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Table</h3>
                                <p className="text-gray-500">Choose a table to view menu and manage orders</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}