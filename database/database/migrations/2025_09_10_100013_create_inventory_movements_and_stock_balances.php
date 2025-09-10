<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('inventory_movements', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->unsignedBigInteger('warehouse_id');
    $table->unsignedBigInteger('product_id');
    $table->string('direction',10); // in, out
    $table->decimal('qty_base',14,6);
    $table->decimal('unit_cost',14,6)->nullable();
    $table->string('reason',30); // purchase, sale, adjustment, sale_return, purchase_return
    $table->unsignedBigInteger('sales_invoice_item_id')->nullable();
    $table->unsignedBigInteger('purchase_invoice_item_id')->nullable();
    $table->unsignedBigInteger('sales_return_item_id')->nullable();
    $table->unsignedBigInteger('purchase_return_item_id')->nullable();
    $table->unsignedBigInteger('adjustment_item_id')->nullable();
    $table->string('note',255)->nullable();
    $table->dateTime('moved_at');
    $table->timestamps();

    $table->foreign('warehouse_id')->references('id')->on('warehouses');
    $table->foreign('product_id')->references('id')->on('products');
    $table->foreign('sales_invoice_item_id')->references('id')->on('sales_invoice_items')->nullOnDelete();
    $table->foreign('purchase_invoice_item_id')->references('id')->on('purchase_invoice_items')->nullOnDelete();
    $table->foreign('sales_return_item_id')->references('id')->on('sales_return_items')->nullOnDelete();
    $table->foreign('purchase_return_item_id')->references('id')->on('purchase_return_items')->nullOnDelete();
    $table->foreign('adjustment_item_id')->references('id')->on('adjustment_items')->nullOnDelete();

    $table->index(['warehouse_id','product_id','moved_at']);
});

Schema::create('stock_balances', function (Blueprint $table) {
    $table->unsignedBigInteger('warehouse_id');
    $table->unsignedBigInteger('product_id');
    $table->decimal('qty_base',14,6)->default(0);
    $table->timestamp('updated_at')->nullable();

    $table->primary(['warehouse_id','product_id']);
    $table->foreign('warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
    $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
});

    }

    public function down(): void {

Schema::dropIfExists('stock_balances');
Schema::dropIfExists('inventory_movements');

    }
};
