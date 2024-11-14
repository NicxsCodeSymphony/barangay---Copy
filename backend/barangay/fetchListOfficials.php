<?php

include "../connection.php";

header('Content-Type: application/json');

$query = "SELECT * FROM official_list";
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

