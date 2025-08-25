<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Models\Table;
use Inertia\Inertia;

class TableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tables = Table::with('currentOrder')->orderBy('number')->get();

        return Inertia::render('tables/index', [
            'tables' => $tables,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('tables/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTableRequest $request)
    {
        Table::create($request->validated());

        return redirect()->route('tables.index')
            ->with('success', 'Table created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Table $table)
    {
        $table->load(['orders.items.menuItem', 'currentOrder.items.menuItem']);

        return Inertia::render('tables/show', [
            'table' => $table,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Table $table)
    {
        return Inertia::render('tables/edit', [
            'table' => $table,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTableRequest $request, Table $table)
    {
        $table->update($request->validated());

        return redirect()->route('tables.show', $table)
            ->with('success', 'Table updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Table $table)
    {
        if ($table->currentOrder) {
            return back()->with('error', 'Cannot delete table with active order.');
        }

        $table->delete();

        return redirect()->route('tables.index')
            ->with('success', 'Table deleted successfully.');
    }
}