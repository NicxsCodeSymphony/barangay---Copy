<?php
include '../connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = 1; // Assuming you want to update the barangay with ID = 1
    $barangayName = $_POST['barangayName'];
    $municipality = $_POST['municipality'];
    $province = $_POST['province'];
    $phoneNumber = $_POST['phone'];
    $email = $_POST['email'];

    // Query to get the current image
    $sql = "SELECT image FROM barangay_info WHERE barangay_id=?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Error preparing SQL query: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($currentPhoto);
    $stmt->fetch();
    $stmt->close();

    $photoPath = $currentPhoto;

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == UPLOAD_ERR_OK) {
        if ($photoPath && file_exists($photoPath)) {
            unlink($photoPath); 
        }

        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $photoName = basename($_FILES['photo']['name']);
        $photoPath = $uploadDir . $photoName;

        if (!move_uploaded_file($_FILES['photo']['tmp_name'], $photoPath)) {
            echo json_encode(["status" => "error", "message" => "Error uploading the photo."]);
            exit;
        }
    }

    $sql = "UPDATE barangay_info SET barangay_name=?, municipality=?, province=?, phone=?, email=?, image=? WHERE barangay_id=?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Error preparing SQL query: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("ssssssi", $barangayName, $municipality, $province, $phoneNumber, $email, $photoPath, $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>
