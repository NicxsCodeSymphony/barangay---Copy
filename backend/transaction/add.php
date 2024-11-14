<?php

include "../connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->resident_id) && isset($data->transaction_code) && isset($data->payment_method) &&
        isset($data->certificate) && isset($data->payment_fee) && isset($data->payment_status) &&
        isset($data->issue_by)) {
        
        $resident_id = mysqli_real_escape_string($conn, $data->resident_id);
        $transaction_code = mysqli_real_escape_string($conn, $data->transaction_code);
        $payment_method = mysqli_real_escape_string($conn, $data->payment_method);
        $certificate = mysqli_real_escape_string($conn, $data->certificate);
        $payment_fee = mysqli_real_escape_string($conn, $data->payment_fee);
        $payment_status = mysqli_real_escape_string($conn, $data->payment_status);
        $issue_by = mysqli_real_escape_string($conn, $data->issue_by);

        $insert_query = "INSERT INTO transaction (resident_id, transaction_code, payment_method, 
                            certificate, payment_fee, payment_status, issue_by) 
                            VALUES ('$resident_id', '$transaction_code', '$payment_method', 
                                    '$certificate', '$payment_fee', '$payment_status', '$issue_by')";
        
        if (mysqli_query($conn, $insert_query)) {
            $response = array('status' => 'success', 'message' => 'Transaction added successfully.');
            echo json_encode($response);
        } else {
            $response = array('status' => 'error', 'message' => 'Failed to add transaction.');
            echo json_encode($response);
        }
    } else {
        $response = array('status' => 'error', 'message' => 'Missing required fields.');
        echo json_encode($response);
    }
} else {
    $response = array('status' => 'error', 'message' => 'Invalid request method.');
    echo json_encode($response);
}

?>
