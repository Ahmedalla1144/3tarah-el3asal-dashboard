<?php

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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 180);
            $table->string('phone', 40)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('email', 150)->nullable()->unique();
            $table->string('tax_id', 60)->nullable();
            $table->decimal('opening_balance', 14, 2)->default(0);
            $table->decimal('credit_limit', 14, 2)->default(0);
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
