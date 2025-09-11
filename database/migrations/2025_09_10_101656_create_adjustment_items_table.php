<?php

use App\Models\Adjustment;
use App\Models\Product;
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
        Schema::create('adjustment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Adjustment::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Product::class)->constrained();
            $table->foreignIdFor(Unit::class)->constrained();
            $table->decimal('qty_delta', 14, 3); // + in, - out
            $table->integer('qty_base')->default(0);
            $table->string('note', 255)->nullable();
            $table->index(['product_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adjustment_items');
    }
};
