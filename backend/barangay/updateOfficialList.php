<?php
// updateOfficialList.php
include '../connection.php'; 

$official_id = isset($_GET['id']) ? $_GET['id'] : null;

if ($official_id === null) {
    echo json_encode(['status' => 'error', 'message' => 'Official ID is required']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method != 'POST' && $method != 'PUT') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);



$status = $data['status'];

$sql = "UPDATE official_list SET status = ? WHERE official_list_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $official_id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Official updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update official']);
}

// Close the database connection
$stmt->close();
$conn->close();
?>
