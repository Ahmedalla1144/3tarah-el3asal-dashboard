<?php

use App\Models\ApPayment;
use App\Models\PurchaseInvoice;
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
        Schema::create('ap_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ApPayment::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(PurchaseInvoice::class)->constrained()->cascadeOnDelete();
            $table->decimal('amount', 14, 2);
            $table->index(['purchase_invoice_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ap_allocations');
    }
};
