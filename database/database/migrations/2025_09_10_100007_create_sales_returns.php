<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('sales_returns', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('number',40)->unique();
    $table->unsignedBigInteger('customer_id');
    $table->unsignedBigInteger('warehouse_id');
    $table->date('date');
    $table->string('status',20)->default('open'); // open, finalized, cancelled
    $table->decimal('subtotal',14,2)->default(0);
    $table->decimal('discount_total',14,2)->default(0);
    $table->decimal('tax_total',14,2)->default(0);
    $table->decimal('total',14,2)->default(0);
    $table->text('notes')->nullable();
    $table->unsignedBigInteger('user_id')->nullable();
    $table->timestamps();

    $table->foreign('customer_id')->references('id')->on('customers');
    $table->foreign('warehouse_id')->references('id')->on('warehouses');
    $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
});

Schema::create('sales_return_items', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->unsignedBigInteger('sales_return_id');
    $table->unsignedBigInteger('product_id');
    $table->unsignedBigInteger('unit_id');
    $table->decimal('qty',14,3);
    $table->decimal('unit_price',14,2);
    $table->decimal('discount_value',14,2)->default(0);
    $table->decimal('tax_value',14,2)->default(0);
    $table->decimal('line_total',14,2);
    $table->unsignedBigInteger('original_sales_item_id')->nullable();
    $table->decimal('qty_base',14,6);
    $table->timestamps();

    $table->foreign('sales_return_id')->references('id')->on('sales_returns')->onDelete('cascade');
    $table->foreign('product_id')->references('id')->on('products');
    $table->foreign('unit_id')->references('id')->on('units');
    $table->foreign('original_sales_item_id')->references('id')->on('sales_invoice_items')->nullOnDelete();
});

    }

    public function down(): void {

Schema::dropIfExists('sales_return_items');
Schema::dropIfExists('sales_returns');

    }
};
