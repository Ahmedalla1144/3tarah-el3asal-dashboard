<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('accounts', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',120);
    $table->string('type',20); // cash, bank, wallet
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

Schema::create('payment_methods', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',40);
    $table->timestamps();
});

    }

    public function down(): void {

Schema::dropIfExists('payment_methods');
Schema::dropIfExists('accounts');

    }
};
