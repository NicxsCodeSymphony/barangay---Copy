<?php
include '../connection.php';

if (isset($_GET['resident_id'])) {
    $id = $_GET['resident_id'];
    $sql = "DELETE FROM residents WHERE resident_id = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Item deleted successfully."]);
        } else {
            echo json_encode(["message" => "Error deleting item."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["message" => "Failed to prepare SQL statement."]);
    }
} else {
    echo json_encode(["message" => "ID parameter is missing."]);
}

$conn->close();
?>
