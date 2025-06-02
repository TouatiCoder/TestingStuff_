<?php

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "TestingStuff";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    echo "Connected successfully to MySQL using mysqli\n";
    
    // Close connection
    $conn->close();
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

// Also try PDO connection
try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully to MySQL using PDO\n";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
