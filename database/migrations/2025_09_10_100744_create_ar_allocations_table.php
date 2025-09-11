<?php

use App\Models\ArReceipt;
use App\Models\SalesInvoice;
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
        Schema::create('ar_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ArReceipt::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(SalesInvoice::class)->constrained()->cascadeOnDelete();
            $table->decimal('amount', 14, 2);
            $table->index(['sales_invoice_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ar_allocations');
    }
};
