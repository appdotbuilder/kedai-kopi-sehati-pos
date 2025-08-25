import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

export default function Dashboard() {
    const menuItems = [
        {
            title: '🛒 Cashier System',
            description: 'Take orders, manage tables, and process payments',
            href: route('cashier.index'),
            color: 'bg-amber-500'
        },
        {
            title: '👨‍🍳 Kitchen Display',
            description: 'View and manage incoming orders from the kitchen',
            href: route('kitchen.index'),
            color: 'bg-orange-500'
        },
        {
            title: '📊 Sales Reports',
            description: 'View daily sales reports and analytics',
            href: route('reports.index'),
            color: 'bg-blue-500'
        },
        {
            title: '🪑 Table Management',
            description: 'Add, edit, and manage café tables',
            href: route('tables.index'),
            color: 'bg-green-500'
        },
        {
            title: '⚙️ Settings',
            description: 'Configure café settings and preferences',
            href: route('profile.edit'),
            color: 'bg-purple-500'
        }
    ];

    return (
        <AppShell>
            <Head title="Dashboard" />
            
            <div className="container mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">☕ Kedai Kopi SEHATI</h1>
                    <p className="text-xl text-gray-600">Complete cashier system for your coffee shop</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-gray-300"
                        >
                            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <span className="text-white text-2xl">
                                    {item.title.split(' ')[0]}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {item.title.substring(2)} {/* Remove emoji from title */}
                            </h3>
                            <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                                {item.description}
                            </p>
                            <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                                Open →
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-6">System Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl mb-2">🪑</div>
                            <div className="text-2xl font-bold">10+</div>
                            <div className="text-amber-100">Tables</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">🍔</div>
                            <div className="text-2xl font-bold">15+</div>
                            <div className="text-amber-100">Menu Items</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">💳</div>
                            <div className="text-2xl font-bold">3</div>
                            <div className="text-amber-100">Payment Methods</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">📊</div>
                            <div className="text-2xl font-bold">24/7</div>
                            <div className="text-amber-100">Reporting</div>
                        </div>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">🚀 Complete POS System</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>• Table management with real-time status</li>
                                <li>• Menu categorization and item management</li>
                                <li>• Order tracking from creation to payment</li>
                                <li>• Kitchen display system with print functionality</li>
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Payment Processing</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>• Cash, QRIS, and Card payment options</li>
                                <li>• Automatic change calculation</li>
                                <li>• Receipt generation and printing</li>
                                <li>• Transaction tracking and reporting</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}