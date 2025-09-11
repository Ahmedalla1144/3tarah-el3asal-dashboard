<?php

use App\Models\Product;
use App\Models\SalesReturn;
use App\Models\SalesReturnItem;
use App\Models\Unit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales_return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(SalesReturn::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Product::class)->constrained();
            $table->foreignIdFor(Unit::class)->constrained();
            $table->decimal('qty', 14, 3);
            $table->decimal('unit_price', 14, 2);
            $table->decimal('discount_value', 14, 2)->default(0);
            $table->decimal('tax_value', 14, 2)->default(0);
            $table->decimal('line_total', 14, 2);
            $table->foreignIdFor(SalesReturnItem::class, 'original_sales_item_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('qty_base')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_return_items');
    }
};
