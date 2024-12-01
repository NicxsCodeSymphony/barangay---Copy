<?php
include "../connection.php";  

function getTotalRecords($tableName, $conn) {
    $sql = "SELECT COUNT(*) AS total FROM " . $tableName;
    $result = $conn->query($sql);
    
    if ($result) {
        $row = $result->fetch_assoc();
        return $row['total'];
    } else {
        return 0;  
    }
}

$residentsCount = getTotalRecords('residents', $conn);
$officialsCount = getTotalRecords('officials', $conn);

$totalCount = $residentsCount + $officialsCount;

$response = array(
    "residents_count" => $residentsCount,
    "officials_count" => $officialsCount,
    "total" => $totalCount  
);

header('Content-Type: application/json');

echo json_encode($response);

$conn->close();
?>
