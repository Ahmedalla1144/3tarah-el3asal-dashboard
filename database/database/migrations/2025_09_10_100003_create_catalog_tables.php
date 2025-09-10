<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('categories', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',120);
    $table->timestamps();
});

Schema::create('units', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',40);
    $table->timestamps();
});

Schema::create('products', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',180);
    $table->unsignedBigInteger('category_id')->nullable();
    $table->string('sku',80)->nullable();
    $table->string('barcode',80)->nullable();
    $table->unsignedBigInteger('base_unit_id');
    $table->decimal('sale_price',14,2)->nullable();
    $table->decimal('cost_price',14,2)->nullable();
    $table->decimal('min_stock',14,3)->default(0);
    $table->boolean('is_batch_tracked')->default(false);
    $table->boolean('is_active')->default(true);
    $table->timestamps();

    $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
    $table->foreign('base_unit_id')->references('id')->on('units');
    $table->index(['category_id','is_active']);
});

Schema::create('product_units', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->unsignedBigInteger('product_id');
    $table->unsignedBigInteger('unit_id');
    $table->decimal('ratio_to_base',14,6);
    $table->boolean('is_default_sale')->default(false);
    $table->boolean('is_default_buy')->default(false);
    $table->timestamps();

    $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
    $table->foreign('unit_id')->references('id')->on('units');
    $table->unique(['product_id','unit_id']);
});

    }

    public function down(): void {

Schema::dropIfExists('product_units');
Schema::dropIfExists('products');
Schema::dropIfExists('units');
Schema::dropIfExists('categories');

    }
};
