<?php

include "../connection.php";

header("Access-Control-Allow-Origin: *"); // Allow any domain to access this API
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow the Content-Type header

// Handle OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Pre-flight request, just exit
    exit(0);
}

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['actor'], $input['action'])) {
    $actor = $input['actor'];
    $action = $input['action'];
    $details = $input['details'];  // Fix missing semicolon
    $time = isset($input['time']) ? $input['time'] : date('Y-m-d H:i:s'); // Optional time field

    // Prepare the SQL query
    $stmt = $conn->prepare("INSERT INTO audit (actor, action, details, time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $actor, $action, $details, $time); // Fix parameter types

    // Execute and send response
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Audit trail added successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to add audit trail"
        ]);
    }

    // Close the statement
    $stmt->close();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields: actor and action"
    ]);
}

// Close the database connection
$conn->close();
?>
