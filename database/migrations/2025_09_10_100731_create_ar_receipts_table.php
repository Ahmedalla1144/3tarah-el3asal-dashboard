<?php

use App\Models\Account;
use App\Models\Customer;
use App\Models\PaymentMethod;
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
        Schema::create('ar_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('number', 40)->unique();
            $table->foreignIdFor(Customer::class)->constrained();
            $table->foreignIdFor(Account::class)->constrained();
            $table->foreignIdFor(PaymentMethod::class)->constrained();
            $table->decimal('amount', 14, 2);
            $table->dateTime('received_at');
            $table->string('reference_no', 60)->nullable();
            $table->text('notes')->nullable();
            $table->foreignIdFor(User::class)->nullable()->constrained()->nullOnDelete();
            $table->index(['customer_id', 'received_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ar_receipts');
    }
};
