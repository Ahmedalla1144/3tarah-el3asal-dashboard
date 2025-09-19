<?php

use App\Models\Category;
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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 180);
            $table->foreignIdFor(Category::class)->constrained()->cascadeOnDelete();
            $table->string('sku', 80)->nullable();
            $table->string('barcode', 80)->nullable();
            $table->foreignIdFor(Unit::class, 'base_unit_id')->constrained()->cascadeOnDelete();
            $table->decimal('sale_price', 14, 6)->nullable();
            $table->decimal('cost_price', 14, 6)->nullable();
            $table->decimal('min_stock', 14, 3)->default(0);
            $table->boolean('is_batch_tracked')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['category_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
