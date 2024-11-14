<?php

include "../connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->household_number)) {
        $household_number = mysqli_real_escape_string($conn, $data->household_number);

        $check_query = "SELECT COUNT(*) AS count FROM household WHERE household_number = '$household_number'";
        $result = mysqli_query($conn, $check_query);
        $row = mysqli_fetch_assoc($result);

        if ($row['count'] > 0) {
            $response = array('status' => 'error', 'message' => 'Household number already exists.');
            echo json_encode($response);
        } else {
            $insert_query = "INSERT INTO household (household_number) VALUES ('$household_number')";
            if (mysqli_query($conn, $insert_query)) {
                $response = array('status' => 'success', 'message' => 'Household added successfully.');
                echo json_encode($response);
            } else {
                $response = array('status' => 'error', 'message' => 'Failed to add household.');
                echo json_encode($response);
            }
        }
    } else {
        $response = array('status' => 'error', 'message' => 'Invalid input.');
        echo json_encode($response);
    }
}

?>
