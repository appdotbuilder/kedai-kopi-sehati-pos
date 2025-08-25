<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tables = [
            ['number' => '01', 'name' => 'Table 1', 'capacity' => 2],
            ['number' => '02', 'name' => 'Table 2', 'capacity' => 4],
            ['number' => '03', 'name' => 'Table 3', 'capacity' => 4],
            ['number' => '04', 'name' => 'Table 4', 'capacity' => 6],
            ['number' => '05', 'name' => 'Table 5', 'capacity' => 2],
            ['number' => '06', 'name' => 'Table 6', 'capacity' => 4],
            ['number' => '07', 'name' => 'Table 7', 'capacity' => 8],
            ['number' => '08', 'name' => 'Table 8', 'capacity' => 4],
            ['number' => '09', 'name' => 'Table 9', 'capacity' => 2],
            ['number' => '10', 'name' => 'Table 10', 'capacity' => 6],
        ];

        foreach ($tables as $table) {
            Table::create([
                'number' => $table['number'],
                'name' => $table['name'],
                'capacity' => $table['capacity'],
                'is_available' => true
            ]);
        }
    }
}