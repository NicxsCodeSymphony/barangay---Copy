<?php

include "../connection.php";

header('Content-Type: application/json');

if (isset($_GET['official_id'])) {
    $official_id = mysqli_real_escape_string($conn, $_GET['official_id']); 

    $query = "
        SELECT o.*, ol.name AS position_name 
        FROM officials o
        INNER JOIN official_list ol ON o.position = ol.official_list_id
        WHERE o.official_id = '$official_id'
    ";

    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode($data);  
    } else {
        echo json_encode(array("error" => "No official found with the given ID"));
    }

} else {
    echo json_encode(array("error" => "Missing official_id parameter"));
}

$conn->close();

?>
