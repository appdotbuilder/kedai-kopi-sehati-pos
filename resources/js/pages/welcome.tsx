import React from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Kedai Kopi SEHATI - Cashier System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 text-gray-900">
                <header className="mb-8 w-full max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">☕</div>
                            <h1 className="text-xl font-bold text-amber-800">Kedai Kopi SEHATI</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-amber-600 px-6 py-2 text-white font-medium hover:bg-amber-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg border border-amber-600 px-6 py-2 text-amber-600 font-medium hover:bg-amber-50 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-amber-600 px-6 py-2 text-white font-medium hover:bg-amber-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="flex-1 w-full max-w-6xl">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="mb-6">
                            <div className="text-8xl mb-4">☕</div>
                            <h2 className="text-5xl font-bold text-amber-800 mb-4">
                                Kedai Kopi SEHATI
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Complete cashier system for your coffee shop. Manage tables, orders, kitchen operations, and payments all in one place.
                            </p>
                        </div>
                        
                        {auth.user ? (
                            <div className="flex justify-center gap-4">
                                <Link
                                    href={route('cashier.index')}
                                    className="rounded-lg bg-amber-600 px-8 py-4 text-white text-lg font-medium hover:bg-amber-700 transition-colors shadow-lg"
                                >
                                    🛒 Start Taking Orders
                                </Link>
                                <Link
                                    href={route('kitchen.index')}
                                    className="rounded-lg bg-orange-600 px-8 py-4 text-white text-lg font-medium hover:bg-orange-700 transition-colors shadow-lg"
                                >
                                    👨‍🍳 Kitchen View
                                </Link>
                            </div>
                        ) : (
                            <div className="flex justify-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg bg-amber-600 px-8 py-4 text-white text-lg font-medium hover:bg-amber-700 transition-colors shadow-lg"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100">
                            <div className="text-4xl mb-4">🪑</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Table Management</h3>
                            <p className="text-gray-600">
                                Manage café tables, track availability, and handle table assignments with ease. View occupancy status at a glance.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Order Management</h3>
                            <p className="text-gray-600">
                                Take orders, modify items, move between tables, and track order status from pending to served.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100">
                            <div className="text-4xl mb-4">🍔</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Menu Categories</h3>
                            <p className="text-gray-600">
                                Organized menu with Food, Drinks, and Snacks categories. Easy browsing and item selection for staff.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100">
                            <div className="text-4xl mb-4">👨‍🍳</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Kitchen Display</h3>
                            <p className="text-gray-600">
                                Dedicated kitchen view showing incoming orders, organized by table and category with print functionality.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100">
                            <div className="text-4xl mb-4">💳</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Payment Processing</h3>
                            <p className="text-gray-600">
                                Accept QRIS, Cash, and Card payments. Automatic change calculation and receipt generation.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Sales Reports</h3>
                            <p className="text-gray-600">
                                Daily transaction summaries, popular items analysis, and sales reports filterable by date.
                            </p>
                        </div>
                    </div>

                    {/* Screenshots Section */}
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-gray-800 mb-8">System Preview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-12 border-2 border-dashed border-amber-300">
                                <div className="text-6xl mb-4">🛒</div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Cashier Interface</h4>
                                <p className="text-gray-600">Interactive table layout with real-time order management</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-12 border-2 border-dashed border-orange-300">
                                <div className="text-6xl mb-4">👨‍🍳</div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Kitchen Display</h4>
                                <p className="text-gray-600">Order queue with status tracking and print capabilities</p>
                            </div>
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-white text-center mb-16">
                        <h3 className="text-3xl font-bold mb-8">Everything You Need</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <div className="text-3xl font-bold">10+</div>
                                <div className="text-amber-100">Tables Managed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">3</div>
                                <div className="text-amber-100">Menu Categories</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">3</div>
                                <div className="text-amber-100">Payment Methods</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">∞</div>
                                <div className="text-amber-100">Daily Orders</div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
                        <p className="text-xl text-gray-600 mb-8">
                            Join Kedai Kopi SEHATI and streamline your coffee shop operations today.
                        </p>
                        {!auth.user && (
                            <div className="flex justify-center gap-4">
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-amber-600 px-8 py-4 text-white text-lg font-medium hover:bg-amber-700 transition-colors shadow-lg"
                                >
                                    Create Account
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border-2 border-amber-600 px-8 py-4 text-amber-600 text-lg font-medium hover:bg-amber-50 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="mt-16 text-center text-gray-500">
                    <p>Built with ❤️ for coffee shops everywhere</p>
                </footer>
            </div>
        </>
    );
}