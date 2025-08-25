import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Order {
    id: number;
    order_number: string;
    status: string;
    sent_to_kitchen_at: string;
    table: {
        id: number;
        number: string;
        name: string;
    };
    items: OrderItem[];
    user: {
        name: string;
    };
}

interface OrderItem {
    id: number;
    quantity: number;
    notes: string;
    menu_item: {
        id: number;
        name: string;
        category: {
            name: string;
        };
    };
}

interface Props {
    orders: Order[];
    settings: Record<string, string>;
    [key: string]: unknown;
}

export default function Kitchen({ orders, settings }: Props) {
    const handleStatusUpdate = (orderId: number, status: string) => {
        router.patch(route('kitchen.update', orderId), {
            status,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePrint = (order: Order) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <html>
                <head>
                    <title>Kitchen Ticket - ${order.order_number}</title>
                    <style>
                        body { font-family: monospace; margin: 20px; font-size: 12px; }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
                        .order-info { margin-bottom: 15px; }
                        .items { margin-bottom: 15px; }
                        .item { margin-bottom: 5px; padding: 5px 0; border-bottom: 1px dotted #999; }
                        .category { font-weight: bold; background-color: #f0f0f0; padding: 5px; margin: 10px 0; }
                        .notes { font-style: italic; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>${settings.cafe_name || 'Kedai Kopi SEHATI'}</h2>
                        <h3>KITCHEN TICKET</h3>
                    </div>
                    
                    <div class="order-info">
                        <strong>Order: ${order.order_number}</strong><br>
                        <strong>Table: ${order.table.name}</strong><br>
                        <strong>Server: ${order.user.name}</strong><br>
                        <strong>Time: ${new Date(order.sent_to_kitchen_at).toLocaleString()}</strong>
                    </div>
                    
                    <div class="items">
                        ${Object.entries(
                            order.items.reduce((acc, item) => {
                                const category = item.menu_item.category.name;
                                if (!acc[category]) acc[category] = [];
                                acc[category].push(item);
                                return acc;
                            }, {} as Record<string, OrderItem[]>)
                        ).map(([category, items]) => `
                            <div class="category">${category}</div>
                            ${items.map(item => `
                                <div class="item">
                                    <strong>${item.quantity}x ${item.menu_item.name}</strong>
                                    ${item.notes ? `<div class="notes">Note: ${item.notes}</div>` : ''}
                                </div>
                            `).join('')}
                        `).join('')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; border-top: 2px solid #000; padding-top: 10px;">
                        <p>Thank you!</p>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent_to_kitchen':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'preparing':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'ready':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusEmoji = (status: string) => {
        switch (status) {
            case 'sent_to_kitchen':
                return '📥';
            case 'preparing':
                return '👨‍🍳';
            case 'ready':
                return '✅';
            default:
                return '📋';
        }
    };

    const groupedOrders = orders.reduce((acc, order) => {
        if (!acc[order.status]) acc[order.status] = [];
        acc[order.status].push(order);
        return acc;
    }, {} as Record<string, Order[]>);

    return (
        <AppShell>
            <Head title="Kitchen Display" />
            
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">👨‍🍳 Kitchen Display</h1>
                    <p className="text-gray-600">Track and manage incoming orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Orders</h3>
                        <p className="text-gray-500">Kitchen is all caught up! New orders will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {['sent_to_kitchen', 'preparing'].map((status) => {
                            const statusOrders = groupedOrders[status] || [];
                            if (statusOrders.length === 0) return null;

                            return (
                                <div key={status}>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                        {getStatusEmoji(status)}
                                        {status === 'sent_to_kitchen' ? 'New Orders' : 'Preparing'}
                                        <span className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                                            {statusOrders.length}
                                        </span>
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {statusOrders.map((order) => (
                                            <div key={order.id} className="bg-white rounded-lg shadow-lg border-2">
                                                <div className={`px-6 py-4 border-b rounded-t-lg ${getStatusColor(order.status)}`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{order.order_number}</h3>
                                                            <p className="text-sm opacity-80">Table: {order.table.name}</p>
                                                        </div>
                                                        <div className="text-sm opacity-80">
                                                            {new Date(order.sent_to_kitchen_at).toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm opacity-80">Server: {order.user.name}</p>
                                                </div>

                                                <div className="p-6">
                                                    <div className="space-y-4">
                                                        {Object.entries(
                                                            order.items.reduce((acc, item) => {
                                                                const category = item.menu_item.category.name;
                                                                if (!acc[category]) acc[category] = [];
                                                                acc[category].push(item);
                                                                return acc;
                                                            }, {} as Record<string, OrderItem[]>)
                                                        ).map(([category, items]) => (
                                                            <div key={category}>
                                                                <h4 className="font-semibold text-gray-700 mb-2 pb-1 border-b">
                                                                    {category}
                                                                </h4>
                                                                {items.map((item) => (
                                                                    <div key={item.id} className="ml-4 mb-2">
                                                                        <div className="flex justify-between items-start">
                                                                            <span className="font-medium">
                                                                                {item.quantity}x {item.menu_item.name}
                                                                            </span>
                                                                        </div>
                                                                        {item.notes && (
                                                                            <div className="text-sm text-gray-600 italic mt-1">
                                                                                Note: {item.notes}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex gap-2 mt-6">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handlePrint(order)}
                                                            className="flex-1"
                                                        >
                                                            🖨️ Print
                                                        </Button>
                                                        {order.status === 'sent_to_kitchen' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                Start Preparing
                                                            </Button>
                                                        )}
                                                        {order.status === 'preparing' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleStatusUpdate(order.id, 'ready')}
                                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                            >
                                                                Mark Ready
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppShell>
    );
}