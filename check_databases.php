<?php

// Check both databases for the cpp-programming table or data

// First, check the TestingStuff database
echo "Checking TestingStuff database:\n";
$conn1 = new mysqli('127.0.0.1', 'root1', '', 'TestingStuff');

if ($conn1->connect_error) {
    echo "Connection to TestingStuff failed: " . $conn1->connect_error . "\n";
} else {
    echo "Connected to TestingStuff database successfully\n";
    
    // Get all tables
    $result = $conn1->query("SHOW TABLES");
    if ($result) {
        echo "Tables in TestingStuff database:\n";
        while ($row = $result->fetch_array()) {
            echo "- " . $row[0] . "\n";
        }
        
        // Check if there's a courses table and look for cpp-programming
        $result = $conn1->query("SHOW TABLES LIKE 'courses'");
        if ($result->num_rows > 0) {
            echo "\nChecking courses table for cpp-programming:\n";
            $result = $conn1->query("SELECT * FROM courses WHERE slug = 'cpp-programming'");
            if ($result) {
                if ($result->num_rows > 0) {
                    echo "Found cpp-programming in TestingStuff.courses table\n";
                    $row = $result->fetch_assoc();
                    echo "Course details: " . json_encode($row) . "\n";
                } else {
                    echo "cpp-programming not found in TestingStuff.courses table\n";
                }
            } else {
                echo "Error querying courses table: " . $conn1->error . "\n";
            }
        } else {
            echo "No courses table found in TestingStuff database\n";
        }
    } else {
        echo "Error getting tables: " . $conn1->error . "\n";
    }
    
    $conn1->close();
}

// Next, check the courses_transcript database
echo "\nChecking courses_transcript database:\n";
$conn2 = new mysqli('127.0.0.1', 'root', '1234', 'courses_transcript');

if ($conn2->connect_error) {
    echo "Connection to courses_transcript failed: " . $conn2->connect_error . "\n";
} else {
    echo "Connected to courses_transcript database successfully\n";
    
    // Get all tables
    $result = $conn2->query("SHOW TABLES");
    if ($result) {
        echo "Tables in courses_transcript database:\n";
        while ($row = $result->fetch_array()) {
            echo "- " . $row[0] . "\n";
        }
        
        // Check if there's a courses or transcripts table and look for cpp-programming
        $tables = ['courses', 'transcripts', 'course_transcripts'];
        foreach ($tables as $table) {
            $result = $conn2->query("SHOW TABLES LIKE '$table'");
            if ($result->num_rows > 0) {
                echo "\nChecking $table table for cpp-programming:\n";
                $result = $conn2->query("SELECT * FROM $table WHERE slug = 'cpp-programming' OR course_slug = 'cpp-programming'");
                if ($result) {
                    if ($result->num_rows > 0) {
                        echo "Found cpp-programming in courses_transcript.$table table\n";
                        $row = $result->fetch_assoc();
                        echo "Details: " . json_encode($row) . "\n";
                    } else {
                        echo "cpp-programming not found in courses_transcript.$table table\n";
                    }
                } else {
                    echo "Error querying $table table: " . $conn2->error . "\n";
                }
            }
        }
    } else {
        echo "Error getting tables: " . $conn2->error . "\n";
    }
    
    $conn2->close();
}
