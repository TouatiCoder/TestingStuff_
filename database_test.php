<?php

// Test direct database connection
$host = '127.0.0.1';
$db   = 'TestingStuff';
$user = 'root1';
$pass = '1234';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "Database connection successful!\n";
    
    // Test query
    $stmt = $pdo->query('SELECT 1');
    $result = $stmt->fetch();
    echo "Query result: " . print_r($result, true) . "\n";
    
} catch (\PDOException $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
}
