<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\SalesInvoiceController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::middleware('can:access-all')->group(function () {
        Route::resource('products', ProductController::class);
        Route::resource('categories', CategoryController::class);
        Route::resource('warehouses', WarehouseController::class);
        Route::resource('suppliers', SupplierController::class);
        Route::resource('customers', CustomerController::class);
        Route::resource('users', UserController::class)->except(['show']);
    });

    Route::middleware('can:access-sales-invoices')->group(function () {
        Route::resource('sales-invoices', SalesInvoiceController::class)->only(['index', 'create', 'store']);
        Route::get('sales-invoices/{salesInvoice}/pay', [SalesInvoiceController::class, 'payForm'])->name('sales-invoices.pay.form');
        Route::post('sales-invoices/{salesInvoice}/pay', [SalesInvoiceController::class, 'pay'])->name('sales-invoices.pay');
        Route::resource('purchase-invoices', PurchaseInvoiceController::class)->only(['index', 'create', 'store', 'show']);
        Route::get('purchase-invoices/{purchaseInvoice}/pay', [PurchaseInvoiceController::class, 'payForm'])->name('purchase-invoices.pay.form');
        Route::post('purchase-invoices/{purchaseInvoice}/pay', [PurchaseInvoiceController::class, 'pay'])->name('purchase-invoices.pay');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
