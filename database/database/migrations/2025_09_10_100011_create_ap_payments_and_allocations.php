<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('ap_payments', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('number',40)->unique();
    $table->unsignedBigInteger('supplier_id');
    $table->unsignedBigInteger('account_id');
    $table->unsignedBigInteger('payment_method_id');
    $table->decimal('amount',14,2);
    $table->dateTime('paid_at');
    $table->string('reference_no',60)->nullable();
    $table->text('notes')->nullable();
    $table->unsignedBigInteger('user_id')->nullable();
    $table->timestamps();

    $table->foreign('supplier_id')->references('id')->on('suppliers');
    $table->foreign('account_id')->references('id')->on('accounts');
    $table->foreign('payment_method_id')->references('id')->on('payment_methods');
    $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();

    $table->index(['supplier_id','paid_at']);
});

Schema::create('ap_allocations', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->unsignedBigInteger('ap_payment_id');
    $table->unsignedBigInteger('purchase_invoice_id');
    $table->decimal('amount',14,2);
    $table->timestamps();

    $table->foreign('ap_payment_id')->references('id')->on('ap_payments')->onDelete('cascade');
    $table->foreign('purchase_invoice_id')->references('id')->on('purchase_invoices')->onDelete('cascade');
    $table->index(['purchase_invoice_id']);
});

    }

    public function down(): void {

Schema::dropIfExists('ap_allocations');
Schema::dropIfExists('ap_payments');

    }
};
