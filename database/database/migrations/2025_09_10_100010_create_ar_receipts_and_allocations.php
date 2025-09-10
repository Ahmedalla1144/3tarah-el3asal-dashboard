<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

Schema::create('ar_receipts', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('number',40)->unique();
    $table->unsignedBigInteger('customer_id');
    $table->unsignedBigInteger('account_id');
    $table->unsignedBigInteger('payment_method_id');
    $table->decimal('amount',14,2);
    $table->dateTime('received_at');
    $table->string('reference_no',60)->nullable();
    $table->text('notes')->nullable();
    $table->unsignedBigInteger('user_id')->nullable();
    $table->timestamps();

    $table->foreign('customer_id')->references('id')->on('customers');
    $table->foreign('account_id')->references('id')->on('accounts');
    $table->foreign('payment_method_id')->references('id')->on('payment_methods');
    $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();

    $table->index(['customer_id','received_at']);
});

Schema::create('ar_allocations', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->unsignedBigInteger('ar_receipt_id');
    $table->unsignedBigInteger('sales_invoice_id');
    $table->decimal('amount',14,2);
    $table->timestamps();

    $table->foreign('ar_receipt_id')->references('id')->on('ar_receipts')->onDelete('cascade');
    $table->foreign('sales_invoice_id')->references('id')->on('sales_invoices')->onDelete('cascade');
    $table->index(['sales_invoice_id']);
});

    }

    public function down(): void {

Schema::dropIfExists('ar_allocations');
Schema::dropIfExists('ar_receipts');

    }
};
