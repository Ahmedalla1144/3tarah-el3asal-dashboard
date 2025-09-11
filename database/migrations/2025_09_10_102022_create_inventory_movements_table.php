<?php

use App\Models\AdjustmentItem;
use App\Models\Product;
use App\Models\PurchaseInvoiceItem;
use App\Models\PurchaseReturnItem;
use App\Models\SalesInvoiceItem;
use App\Models\SalesReturnItem;
use App\Models\Warehouse;
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
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Warehouse::class)->constrained();
            $table->foreignIdFor(Product::class)->constrained();
            $table->string('direction', 10); // in, out
            $table->integer('qty_base')->default(0);
            $table->decimal('unit_cost', 14, 6)->nullable();
            $table->string('reason', 30); // purchase, sale, adjustment, sale_return, purchase_return
            $table->foreignIdFor(SalesInvoiceItem::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(PurchaseInvoiceItem::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(SalesReturnItem::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(PurchaseReturnItem::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(AdjustmentItem::class)->nullable()->constrained()->nullOnDelete();
            $table->string('note', 255)->nullable();
            $table->dateTime('moved_at');
            $table->index(['warehouse_id', 'product_id', 'moved_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
