        <?php

        include "../connection.php";

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"));

            if (isset($data->purok_name)) {
                $purok_name = mysqli_real_escape_string($conn, $data->purok_name);

                $query = "INSERT INTO purok (purok_name, resident_count) VALUES ('$purok_name', 0)";
                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Purok added successfully.');
                    echo json_encode($response);
                } else {
                    $response = array('status' => 'error', 'message' => 'Failed to add Purok.');
                    echo json_encode($response);
                }
            } else {
                $response = array('status' => 'error', 'message' => 'Invalid input.');
                echo json_encode($response);
            }
        }
        ?>
