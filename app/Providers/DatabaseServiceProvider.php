<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class DatabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Explicitly set the MySQL connection configuration
        config(['database.connections.mysql.password' => '1234']);
        
        // Reconnect to the database with the new configuration
        DB::reconnect();
    }
}
