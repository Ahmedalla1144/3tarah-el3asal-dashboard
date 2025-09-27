<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Category;
use App\Models\Customer;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\ProductUnit;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceItem;
use App\Models\Role;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use App\Models\Sequence;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\User;
use App\Models\Warehouse;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Users & Roles
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        $cashier = User::factory()->create([
            'name' => 'Cashier',
            'email' => 'cashier@example.com',
            'password' => bcrypt('password'),
        ]);

        $roleAdmin = Role::query()->firstOrCreate(['name' => 'admin']);
        $roleCashier = Role::query()->firstOrCreate(['name' => 'cashier']);
        DB::table('role_user')->insert([
            ['user_id' => $admin->id, 'role_id' => $roleAdmin->id],
            ['user_id' => $cashier->id, 'role_id' => $roleCashier->id],
        ]);

        // Accounts & Payment Methods
        $cash = Account::query()->firstOrCreate(['name' => 'خزنة رئيسية'], ['type' => 'cash', 'is_active' => true]);
        $bank = Account::query()->firstOrCreate(['name' => 'بنك مصر'], ['type' => 'bank', 'is_active' => true]);
        $pmCash = PaymentMethod::query()->firstOrCreate(['name' => 'cash']);
        $pmCard = PaymentMethod::query()->firstOrCreate(['name' => 'card']);

        // Warehouses
        $wh = Warehouse::query()->firstOrCreate(['name' => 'المخزن الرئيسي']);

        // Units (base: gram)
        $uGram = Unit::query()->firstOrCreate(['name' => 'جرام']);
        $uKg   = Unit::query()->firstOrCreate(['name' => 'كيلوجرام']);
        $uPack = Unit::query()->firstOrCreate(['name' => 'عبوة']);

        // Categories
        $catSpices = Category::query()->firstOrCreate(['name' => 'بهارات']);
        $catHerbs  = Category::query()->firstOrCreate(['name' => 'أعشاب']);

        // Products
        $products = [
            ['name' => 'كمون', 'category_id' => $catSpices->id, 'base_unit_id' => $uGram->id, 'sale_price' => 120, 'cost_price' => 90, 'min_stock' => 500],
            ['name' => 'كركم', 'category_id' => $catSpices->id, 'base_unit_id' => $uGram->id, 'sale_price' => 110, 'cost_price' => 85, 'min_stock' => 500],
            ['name' => 'فلفل أسود', 'category_id' => $catSpices->id, 'base_unit_id' => $uGram->id, 'sale_price' => 200, 'cost_price' => 150, 'min_stock' => 500],
            ['name' => 'نعناع', 'category_id' => $catHerbs->id, 'base_unit_id' => $uGram->id, 'sale_price' => 90, 'cost_price' => 60, 'min_stock' => 300],
        ];

        User::factory(10)->create();
        Warehouse::factory(10)->create();
        Supplier::factory(20)->create();
        Customer::factory(25)->create();

        Product::factory(50)->create();

        SalesInvoice::factory(100)->create();
        PurchaseInvoice::factory(100)->create();

        foreach ($products as $p) {
            $product = Product::query()->firstOrCreate(
                ['name' => $p['name']],
                [
                    'category_id' => $p['category_id'],
                    'base_unit_id' => $p['base_unit_id'],
                    'sale_price' => $p['sale_price'],
                    'cost_price' => $p['cost_price'],
                    'min_stock' => $p['min_stock'],
                    'sku' => null,
                    'barcode' => null,
                    'is_batch_tracked' => false,
                    'is_active' => true
                ]
            );

            // Define product units: gram (1) and kilogram (1000)
            ProductUnit::query()->firstOrCreate([
                'product_id' => $product->id,
                'unit_id' => $uGram->id
            ], [
                'ratio_to_base' => 1,
                'is_default_sale' => false,
                'is_default_buy' => false
            ]);

            ProductUnit::query()->firstOrCreate([
                'product_id' => $product->id,
                'unit_id' => $uKg->id
            ], [
                'ratio_to_base' => 1000,
                'is_default_sale' => true,
                'is_default_buy' => true
            ]);

            // Optional pack unit (assume 250g per pack)
            ProductUnit::query()->firstOrCreate([
                'product_id' => $product->id,
                'unit_id' => $uPack->id
            ], [
                'ratio_to_base' => 250,
                'is_default_sale' => false,
                'is_default_buy' => false
            ]);
        }

        // Parties
        $cust = Customer::factory()->create(['name' => 'عميل 1', 'credit_limit' => 0]);
        $sup  = Supplier::factory()->create(['name' => 'مورد 1']);

        // Sequences
        $seqs = [
            ['name' => 'sales_invoice', 'prefix' => 'SI-', 'next_no' => 1, 'padding' => 6],
            ['name' => 'purchase_invoice', 'prefix' => 'PI-', 'next_no' => 1, 'padding' => 6],
            ['name' => 'sales_return', 'prefix' => 'SR-', 'next_no' => 1, 'padding' => 6],
            ['name' => 'purchase_return', 'prefix' => 'PR-', 'next_no' => 1, 'padding' => 6],
            ['name' => 'ar_receipt', 'prefix' => 'RC-', 'next_no' => 1, 'padding' => 6],
            ['name' => 'ap_payment', 'prefix' => 'PY-', 'next_no' => 1, 'padding' => 6],
        ];
        foreach ($seqs as $s) {
            Sequence::query()->firstOrCreate(['name' => $s['name']], [
                'prefix' => $s['prefix'],
                'next_no' => $s['next_no'],
                'padding' => $s['padding']
            ]);
        }

        // Optional: create a simple opening adjustment for each product (1000 g)
        $adjustmentId = DB::table('adjustments')->insertGetId([
            'warehouse_id' => $wh->id,
            'user_id' => $admin->id,
            'reason' => 'opening balance',
            'status' => 'posted',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $productIds = Product::query()->pluck('id')->all();
        foreach ($productIds as $pid) {
            $qtyBase = fake()->numberBetween(1000, 10000);
            // add 1000 g opening stock
            DB::table('adjustment_items')->insert([
                'adjustment_id' => $adjustmentId,
                'product_id' => $pid,
                'unit_id' => $uGram->id,
                'qty_delta' => 1000,
                'qty_base' => $qtyBase,
                'note' => 'Opening stock',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // reflect in inventory_movements (IN)
            DB::table('inventory_movements')->insert([
                'warehouse_id' => $wh->id,
                'product_id' => $pid,
                'direction' => 'in',
                'qty_base' => $qtyBase,
                'unit_cost' => null,
                'reason' => 'adjustment',
                'adjustment_item_id' => DB::getPdo()->lastInsertId(),
                'note' => 'Opening stock',
                'moved_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // update stock_balances
            $existing = DB::table('stock_balances')->where([
                'warehouse_id' => $wh->id,
                'product_id' => $pid
            ])->first();
            if ($existing) {
                DB::table('stock_balances')->where([
                    'warehouse_id' => $wh->id,
                    'product_id' => $pid
                ])->update([
                    'qty_base' => DB::raw('qty_base + $qtyBase'),
                    'updated_at' => now()
                ]);
            } else {
                DB::table('stock_balances')->insert([
                    'warehouse_id' => $wh->id,
                    'product_id' => $pid,
                    'qty_base' => $qtyBase,
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
