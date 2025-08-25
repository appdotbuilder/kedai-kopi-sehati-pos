<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $drinks = Category::where('slug', 'drinks')->first();
        $food = Category::where('slug', 'food')->first();
        $snacks = Category::where('slug', 'snacks')->first();

        $menuItems = [
            // Drinks
            [
                'category_id' => $drinks->id,
                'name' => 'Espresso',
                'description' => 'Strong coffee shot',
                'price' => 15000,
                'sort_order' => 1
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Cappuccino',
                'description' => 'Espresso with steamed milk and foam',
                'price' => 25000,
                'sort_order' => 2
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Latte',
                'description' => 'Espresso with steamed milk',
                'price' => 28000,
                'sort_order' => 3
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Americano',
                'description' => 'Espresso with hot water',
                'price' => 18000,
                'sort_order' => 4
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Iced Coffee',
                'description' => 'Cold coffee with ice',
                'price' => 22000,
                'sort_order' => 5
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Tea',
                'description' => 'Hot tea',
                'price' => 12000,
                'sort_order' => 6
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Iced Tea',
                'description' => 'Cold tea with ice',
                'price' => 15000,
                'sort_order' => 7
            ],

            // Food
            [
                'category_id' => $food->id,
                'name' => 'Nasi Goreng',
                'description' => 'Indonesian fried rice',
                'price' => 25000,
                'sort_order' => 1
            ],
            [
                'category_id' => $food->id,
                'name' => 'Mie Goreng',
                'description' => 'Indonesian fried noodles',
                'price' => 23000,
                'sort_order' => 2
            ],
            [
                'category_id' => $food->id,
                'name' => 'Gado-Gado',
                'description' => 'Indonesian salad with peanut sauce',
                'price' => 20000,
                'sort_order' => 3
            ],
            [
                'category_id' => $food->id,
                'name' => 'Sandwich',
                'description' => 'Club sandwich with fries',
                'price' => 30000,
                'sort_order' => 4
            ],
            [
                'category_id' => $food->id,
                'name' => 'Pasta',
                'description' => 'Spaghetti with tomato sauce',
                'price' => 35000,
                'sort_order' => 5
            ],

            // Snacks
            [
                'category_id' => $snacks->id,
                'name' => 'Croissant',
                'description' => 'Buttery pastry',
                'price' => 15000,
                'sort_order' => 1
            ],
            [
                'category_id' => $snacks->id,
                'name' => 'Muffin',
                'description' => 'Chocolate chip muffin',
                'price' => 18000,
                'sort_order' => 2
            ],
            [
                'category_id' => $snacks->id,
                'name' => 'Cookies',
                'description' => 'Assorted cookies (3 pieces)',
                'price' => 12000,
                'sort_order' => 3
            ],
            [
                'category_id' => $snacks->id,
                'name' => 'Cake Slice',
                'description' => 'Chocolate cake slice',
                'price' => 22000,
                'sort_order' => 4
            ],
            [
                'category_id' => $snacks->id,
                'name' => 'French Fries',
                'description' => 'Crispy potato fries',
                'price' => 15000,
                'sort_order' => 5
            ],
        ];

        foreach ($menuItems as $item) {
            MenuItem::create([
                'category_id' => $item['category_id'],
                'name' => $item['name'],
                'slug' => Str::slug($item['name']),
                'description' => $item['description'],
                'price' => $item['price'],
                'sort_order' => $item['sort_order'],
                'is_available' => true
            ]);
        }
    }
}