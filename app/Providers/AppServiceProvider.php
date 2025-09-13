<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('access-all', function (User $user) {
            return $user->hasRole('admin');
        });

        Gate::define('access-sales-invoices', function (User $user) {
            return $user->hasRole(['admin', 'cashier']);
        });

        Inertia::share('auth', function () {
            $authUser = Auth::user();
            if (!$authUser) {
                return ['user' => null];
            }

            $user = User::query()->with('roles:id,name')->find($authUser->id);

            return [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                ] : null,
            ];
        });
    }
}
