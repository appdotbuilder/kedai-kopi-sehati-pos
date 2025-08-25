<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'cafe_name',
                'value' => 'Kedai Kopi SEHATI',
                'type' => 'string',
                'description' => 'Name of the coffee shop'
            ],
            [
                'key' => 'cafe_logo',
                'value' => '/images/logo.png',
                'type' => 'string',
                'description' => 'Path to the cafe logo'
            ],
            [
                'key' => 'tax_rate',
                'value' => '0.10',
                'type' => 'float',
                'description' => 'Tax rate as decimal (10%)'
            ],
            [
                'key' => 'currency',
                'value' => 'IDR',
                'type' => 'string',
                'description' => 'Currency code'
            ],
            [
                'key' => 'receipt_footer',
                'value' => 'Terima kasih telah berkunjung!\nSampai jumpa lagi.',
                'type' => 'string',
                'description' => 'Footer text for receipts'
            ]
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}