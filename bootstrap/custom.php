<?php

// Load the custom database configuration
$app = require_once __DIR__.'/../bootstrap/app.php';

// Replace the database configuration with our custom one
$app->make('config')->set('database', require __DIR__.'/../config/database.custom.php');

return $app;
