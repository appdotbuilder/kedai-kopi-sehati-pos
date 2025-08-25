<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Drinks',
                'description' => 'Beverages including coffee, tea, and other drinks',
                'sort_order' => 1
            ],
            [
                'name' => 'Food',
                'description' => 'Main dishes, rice, noodles, and other food items',
                'sort_order' => 2
            ],
            [
                'name' => 'Snacks',
                'description' => 'Light snacks, pastries, and desserts',
                'sort_order' => 3
            ]
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'sort_order' => $category['sort_order'],
                'is_active' => true
            ]);
        }
    }
}