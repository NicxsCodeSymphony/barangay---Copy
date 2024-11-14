<?php

include "../connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the input data
    $data = json_decode(file_get_contents("php://input"));

    // Check if the required fields are provided
    if (isset($data->transaction_id) && isset($data->payment_status)) {
        
        $transaction_id = mysqli_real_escape_string($conn, $data->transaction_id);
        $payment_status = mysqli_real_escape_string($conn, $data->payment_status);

        // Update the payment status for the given transaction ID
        $update_query = "UPDATE transaction 
                         SET payment_status = '$payment_status' 
                         WHERE transaction_id = '$transaction_id'";

        // Execute the query and check for success
        if (mysqli_query($conn, $update_query)) {
            $response = array('status' => 'success', 'message' => 'Payment status updated successfully.');
            echo json_encode($response);
        } else {
            // If the update query fails, return an error message
            $response = array('status' => 'error', 'message' => 'Failed to update payment status.');
            echo json_encode($response);
        }
    } else {
        // If any required field is missing, return error
        $response = array('status' => 'error', 'message' => 'Missing required fields.');
        echo json_encode($response);
    }
} else {
    // If the request method is not POST, return error
    $response = array('status' => 'error', 'message' => 'Invalid request method.');
    echo json_encode($response);
}

?>
