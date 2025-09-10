<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('customers', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',180);
    $table->string('phone',40)->nullable();
    $table->string('address',255)->nullable();
    $table->string('email',150)->nullable();
    $table->string('tax_id',60)->nullable();
    $table->decimal('opening_balance',14,2)->default(0);
    $table->decimal('credit_limit',14,2)->default(0);
    $table->text('notes')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

Schema::create('suppliers', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',180);
    $table->string('phone',40)->nullable();
    $table->string('address',255)->nullable();
    $table->string('email',150)->nullable();
    $table->string('tax_id',60)->nullable();
    $table->decimal('opening_balance',14,2)->default(0);
    $table->text('notes')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

    }

    public function down(): void {

Schema::dropIfExists('suppliers');
Schema::dropIfExists('customers');

    }
};
