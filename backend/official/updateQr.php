<?php
include "../connection.php";

// Get POST data
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['officialId']) && isset($_POST['qrCode'])) {
    $officialId = mysqli_real_escape_string($conn, $_POST['officialId']);
    $qrCode = mysqli_real_escape_string($conn, $_POST['qrCode']);

    // Update QR Code in the database
    $query = "UPDATE officials SET qr_code = '$qrCode' WHERE official_id = '$officialId'";

    if (mysqli_query($conn, $query)) {
        echo json_encode(["status" => "success", "message" => "QR code updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update QR code."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

$conn->close();
?>
