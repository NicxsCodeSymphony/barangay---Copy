<?php

include "../connection.php";

header('Content-Type: application/json');

$query = "
    SELECT o.*, ol.purok_name AS purok_name 
    FROM residents o
    INNER JOIN purok ol ON o.purok = ol.purok_id
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
