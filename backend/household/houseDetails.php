<?php

include "../connection.php";

header('Content-Type: application/json');

$query = "
   SELECT 
      household.household_number,
      household.*, 
      officials.*, 
      residents.*
   FROM 
      household
      LEFT JOIN officials ON household.household_id = officials.household
      LEFT JOIN residents ON household.household_id = residents.household
";


$result = $conn->query($query);

if ($result) {
    $data = array();

    while ($row = $result->fetch_assoc()) {
        $household_number = $row['household_number']; 
        if (!isset($data[$household_number])) {
            $data[$household_number] = array();
        }

        $data[$household_number][] = $row;
    }

    echo json_encode($data);
} else {
    echo json_encode(array("error" => "Failed to fetch data"));
}

$conn->close();
?>
