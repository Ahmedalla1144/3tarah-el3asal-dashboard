<?php

use App\Models\Account;
use App\Models\PaymentMethod;
use App\Models\Supplier;
use App\Models\User;
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
        Schema::create('ap_payments', function (Blueprint $table) {
            $table->id();
            $table->string('number', 40)->unique();
            $table->foreignIdFor(Supplier::class)->constrained();
            $table->foreignIdFor(Account::class)->constrained();
            $table->foreignIdFor(PaymentMethod::class)->constrained();
            $table->decimal('amount', 14, 2);
            $table->dateTime('paid_at');
            $table->string('reference_no', 60)->nullable();
            $table->text('notes')->nullable();
            $table->foreignIdFor(User::class)->nullable()->constrained()->nullOnDelete();
            $table->index(['supplier_id', 'paid_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ap_payments');
    }
};
