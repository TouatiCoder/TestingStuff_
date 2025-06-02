<?php

// Set the database password explicitly
putenv('DB_PASSWORD=1234');

// Run the Laravel server
require __DIR__.'/vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php';
