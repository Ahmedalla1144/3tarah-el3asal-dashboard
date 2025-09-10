<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('adjustments', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->unsignedBigInteger('warehouse_id');
    $table->unsignedBigInteger('user_id')->nullable();
    $table->string('reason',120)->nullable();
    $table->string('status',20)->default('draft'); // draft, posted, cancelled
    $table->timestamps();

    $table->foreign('warehouse_id')->references('id')->on('warehouses');
    $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
});

Schema::create('adjustment_items', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->unsignedBigInteger('adjustment_id');
    $table->unsignedBigInteger('product_id');
    $table->unsignedBigInteger('unit_id');
    $table->decimal('qty_delta',14,3); // + in, - out
    $table->decimal('qty_base',14,6);
    $table->string('note',255)->nullable();
    $table->timestamps();

    $table->foreign('adjustment_id')->references('id')->on('adjustments')->onDelete('cascade');
    $table->foreign('product_id')->references('id')->on('products');
    $table->foreign('unit_id')->references('id')->on('units');
    $table->index(['product_id']);
});

    }

    public function down(): void {

Schema::dropIfExists('adjustment_items');
Schema::dropIfExists('adjustments');

    }
};
