import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Table {
    id: number;
    number: string;
    name: string;
    capacity: number;
    is_available: boolean;
    current_order?: {
        id: number;
        order_number: string;
        status: string;
    };
}

interface Props {
    tables: Table[];
    [key: string]: unknown;
}

export default function TablesIndex({ tables }: Props) {
    return (
        <AppShell>
            <Head title="Table Management" />
            
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">🪑 Table Management</h1>
                        <p className="text-gray-600">Manage café tables and their configurations</p>
                    </div>
                    <Link href={route('tables.create')}>
                        <Button>
                            ➕ Add New Table
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Table
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Capacity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Current Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tables.map((table) => (
                                    <tr key={table.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-2xl mr-3">
                                                    {table.is_available ? '🟢' : '🔴'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {table.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        #{table.number}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {table.capacity} people
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                table.is_available
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {table.is_available ? 'Available' : 'Occupied'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {table.current_order ? (
                                                <div>
                                                    <div className="font-medium">
                                                        {table.current_order.order_number}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Status: {table.current_order.status}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No active order</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('tables.show', table.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('tables.edit', table.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {tables.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🪑</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
                            <p className="text-gray-500 mb-4">Get started by creating your first table.</p>
                            <Link href={route('tables.create')}>
                                <Button>
                                    ➕ Add New Table
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}