<?php

include "../connection.php";

header('Content-Type: application/json');

// $query = "SELECT * FROM audit";
$query = "
    SELECT o.*, ol.first_name  AS official_name, ol.last_name AS official_last_name 
    FROM audit o
    INNER JOIN officials ol ON o.actor = ol.official_id
";
$result = $conn->query($query);

if($result){
    $data = array();
    while($row = $result->fetch_assoc()){
        $data[] = $row;
    }

    echo json_encode($data);

} else{
    echo json_decode(array("error" => "Failed to fetch data"));
}

$conn->close();

