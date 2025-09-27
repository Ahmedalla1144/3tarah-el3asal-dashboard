<?php

use App\Http\Controllers\QzController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductUnitController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\SalesInvoiceController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerPaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UnitController;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::middleware('can:access-all')->group(function () {
        Route::resource('products', ProductController::class);
        Route::get('products/{product}/units', [ProductUnitController::class, 'index'])->name('products.units.index');
        Route::post('products/{product}/units', [ProductUnitController::class, 'store'])->name('products.units.store');
        Route::patch('products/{product}/units/{productUnit}', [ProductUnitController::class, 'update'])->name('products.units.update');
        Route::delete('products/{product}/units/{productUnit}', [ProductUnitController::class, 'destroy'])->name('products.units.destroy');
        Route::resource('categories', CategoryController::class);
        Route::resource('warehouses', WarehouseController::class);
        Route::resource('suppliers', SupplierController::class);
        Route::resource('customers', CustomerController::class);
        Route::resource('units', UnitController::class)->except(['show']);
        Route::get('customers/{customer}/payment', [CustomerPaymentController::class, 'create'])->name('customers.payment.create');
        Route::post('customers/{customer}/payment', [CustomerPaymentController::class, 'store'])->name('customers.payment.store');
        Route::resource('users', UserController::class)->except(['show']);
    });

    Route::middleware('can:access-sales-invoices')->group(function () {
        Route::resource('sales-invoices', SalesInvoiceController::class)->only(['index', 'create', 'store', 'show']);
        Route::get('sales-invoices/{salesInvoice}/print', [SalesInvoiceController::class, 'print'])->name('sales-invoices.print');
        Route::get('sales-invoices/{salesInvoice}/pay', [SalesInvoiceController::class, 'payForm'])->name('sales-invoices.pay.form');
        Route::post('sales-invoices/{salesInvoice}/pay', [SalesInvoiceController::class, 'pay'])->name('sales-invoices.pay');
        Route::resource('purchase-invoices', PurchaseInvoiceController::class)->only(['index', 'create', 'store', 'show']);
        Route::get('purchase-invoices/{purchaseInvoice}/print', [PurchaseInvoiceController::class, 'print'])->name('purchase-invoices.print');
        Route::get('purchase-invoices/{purchaseInvoice}/pay', [PurchaseInvoiceController::class, 'payForm'])->name('purchase-invoices.pay.form');
        Route::post('purchase-invoices/{purchaseInvoice}/pay', [PurchaseInvoiceController::class, 'pay'])->name('purchase-invoices.pay');
    });

    // QZ Tray signing endpoints
    Route::post('/qz/sign', [QzController::class, 'sign'])->name('qz.sign');
    Route::post('/qz/hash', [QzController::class, 'hash'])->name('qz.hash');
    
    // QZ Test page
    Route::get('/qz-test', function () {
        return Inertia::render('QzTest');
    })->name('qz.test');
    
    // Test print page
    Route::get('/test-print', function () {
        return view('test-print');
    })->name('test.print');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
