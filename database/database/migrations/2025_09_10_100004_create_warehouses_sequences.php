<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('warehouses', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',120);
    $table->timestamps();
});

Schema::create('sequences', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name',50)->unique();
    $table->string('prefix',20)->nullable();
    $table->unsignedBigInteger('next_no')->default(1);
    $table->unsignedInteger('padding')->default(6);
    $table->timestamps();
});

    }

    public function down(): void {

Schema::dropIfExists('sequences');
Schema::dropIfExists('warehouses');

    }
};
