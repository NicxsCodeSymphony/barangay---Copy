<?php
include "../connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check for required fields
    $missing_fields = [];

    if (!isset($_POST['id'])) {
        $missing_fields[] = 'id';
    }
    if (!isset($_POST['first_name'])) {
        $missing_fields[] = 'first_name';
    }
    if (!isset($_POST['last_name'])) {
        $missing_fields[] = 'last_name';
    }

    // If there are any missing fields, return an error
    if (!empty($missing_fields)) {
        echo json_encode([
            "status" => "error",
            "message" => "Missing required fields: " . implode(", ", $missing_fields)
        ]);
        exit; // Exit after returning the error
    }

    // If all required fields are present, process the request
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $first_name = mysqli_real_escape_string($conn, $_POST['first_name']);
    $middle_name = mysqli_real_escape_string($conn, $_POST['middle_name']);
    $last_name = mysqli_real_escape_string($conn, $_POST['last_name']);
    $suffix = mysqli_real_escape_string($conn, $_POST['suffix']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
    $gender = mysqli_real_escape_string($conn, $_POST['gender']);
    $birth_date = mysqli_real_escape_string($conn, $_POST['birth_date']);
    $birth_place = mysqli_real_escape_string($conn, $_POST['birth_place']);
    $age = mysqli_real_escape_string($conn, $_POST['age']);
    $civil_status = mysqli_real_escape_string($conn, $_POST['civil_status']);
    $nationality = mysqli_real_escape_string($conn, $_POST['nationality']);
    $religion = mysqli_real_escape_string($conn, $_POST['religion']);
    $occupation = mysqli_real_escape_string($conn, $_POST['occupation']);
    $contact = mysqli_real_escape_string($conn, $_POST['contact']);
    $pwd = isset($_POST['pwd']) ? 1 : 0;  // Boolean flag for pwd
    $education = mysqli_real_escape_string($conn, $_POST['education']);
    $purok = mysqli_real_escape_string($conn, $_POST['purok']);
    $senior_citizen = isset($_POST['senior_citizen']) ? 1 : 0;  // Boolean flag for senior_citizen

    // Default image path if no new image is uploaded
    $image_path = NULL;

    // Get the current image path from the database (if any)
    $sql_check_image = "SELECT image FROM officials WHERE official_id = '$id'";
    $result = mysqli_query($conn, $sql_check_image);
    $current_image = mysqli_fetch_assoc($result)['image'];

    // If the image is uploaded
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        // Process the image upload
        $image_name = $_FILES['image']['name'];
        $image_tmp = $_FILES['image']['tmp_name'];
        $image_extension = strtolower(pathinfo($image_name, PATHINFO_EXTENSION));

        $upload_dir = "./uploads/";

        // Check if the uploads directory exists, if not, create it
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        // Move the uploaded image to the uploads directory
        if (move_uploaded_file($image_tmp, $upload_dir . $image_name)) {
            $image_path = $upload_dir . $image_name;

            // If there was a previous image, delete it
            if ($current_image && file_exists($current_image)) {
                unlink($current_image); // Delete the old image from the server
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload image."]);
            exit;
        }
    } else {
        // If no new image is uploaded, use the current image path (if any)
        $image_path = $current_image;
    }

    // Update the database with the new image path (or keep the current one if no new image)
    $sql_update = "UPDATE officials SET 
                    first_name = '$first_name',
                    middle_name = '$middle_name',
                    last_name = '$last_name',
                    suffix = '$suffix',
                    email = '$email',
                    password = '$password',
                    gender = '$gender',
                    birth_date = '$birth_date',
                    birth_place = '$birth_place',
                    age = '$age',
                    civil_status = '$civil_status',
                    nationality = '$nationality',
                    religion = '$religion',
                    occupation = '$occupation',
                    contact = '$contact',
                    pwd = '$pwd',
                    education = '$education',
                    purok = '$purok',
                    senior_citizen = '$senior_citizen',
                    image = '$image_path'
                WHERE official_id = '$id'";

    // Execute the SQL query
    if (mysqli_query($conn, $sql_update)) {
        echo json_encode([
            "status" => "success",
            "message" => "Official updated successfully."
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update official."]);
    }
}
?>
