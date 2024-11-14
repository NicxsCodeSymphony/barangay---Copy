<?php

include "../connection.php";

header('Content-Type: application/json');

$query = "
    SELECT o.*, ol.name AS position_name 
    FROM officials o
    INNER JOIN official_list ol ON o.position = ol.official_list_id
";

$result = $conn->query($query);

if($result){
    $data = array();
    while($row = $result->fetch_assoc()){
        $data[] = $row;
    }

    echo json_encode($data);

} else{
    echo json_encode(array("error" => "Failed to fetch data"));
}

$conn->close();
