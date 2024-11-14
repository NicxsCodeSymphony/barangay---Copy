<?php
include "connection.php";  

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    $query = "SELECT * FROM officials WHERE email = ?";
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $email);
        
        $stmt->execute();
        
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            if ($password === $user['password']) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Login successful",
                    "token" =>  $user['official_id']
                ]);
            } else {
                // Password is incorrect
                echo json_encode([
                    "status" => "error",
                    "message" => "Invalid email or password"
                ]);
            }
        } else {
            // No user found with the provided email
            echo json_encode([
                "status" => "error",
                "message" => "No user found with that email"
            ]);
        }

        // Close the prepared statement
        $stmt->close();
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Database query failed"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required"
    ]);
}

// Close the database connection
$conn->close();
?>
