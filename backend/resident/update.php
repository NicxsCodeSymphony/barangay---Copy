<?php
include "../connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['id'])) {
        $id = mysqli_real_escape_string($conn, $_POST['id']);

        // Required fields
        $first_name = isset($_POST['first_name']) ? mysqli_real_escape_string($conn, $_POST['first_name']) : null;
        $middle_name = isset($_POST['middle_name']) ? mysqli_real_escape_string($conn, $_POST['middle_name']) : null;
        $last_name = isset($_POST['last_name']) ? mysqli_real_escape_string($conn, $_POST['last_name']) : null;
        $suffix = isset($_POST['suffix']) ? mysqli_real_escape_string($conn, $_POST['suffix']) : null;
        $email = isset($_POST['email']) ? mysqli_real_escape_string($conn, $_POST['email']) : null;
        $gender = isset($_POST['gender']) ? mysqli_real_escape_string($conn, $_POST['gender']) : null;
        $birth_date = isset($_POST['birth_date']) ? mysqli_real_escape_string($conn, $_POST['birth_date']) : null;
        $birth_place = isset($_POST['birth_place']) ? mysqli_real_escape_string($conn, $_POST['birth_place']) : null;
        $age = isset($_POST['age']) ? mysqli_real_escape_string($conn, $_POST['age']) : null;
        $civil_status = isset($_POST['civil_status']) ? mysqli_real_escape_string($conn, $_POST['civil_status']) : null;
        $nationality = isset($_POST['nationality']) ? mysqli_real_escape_string($conn, $_POST['nationality']) : null;
        $religion = isset($_POST['religion']) ? mysqli_real_escape_string($conn, $_POST['religion']) : null;
        $occupation = isset($_POST['occupation']) ? mysqli_real_escape_string($conn, $_POST['occupation']) : null;
        $contact = isset($_POST['contact']) ? mysqli_real_escape_string($conn, $_POST['contact']) : null;
        $pwd = isset($_POST['pwd']) ? 1 : 0;
        $education = isset($_POST['education']) ? mysqli_real_escape_string($conn, $_POST['education']) : null;
        $purok = isset($_POST['purok']) ? mysqli_real_escape_string($conn, $_POST['purok']) : null;
        $senior_citizen = isset($_POST['senior_citizen']) ? 1 : 0;

        // Handle image upload
        $image_path = null;
        $old_image_path = null;

        // Check for the current image path from the database
        $result = mysqli_query($conn, "SELECT image FROM residents WHERE resident_id = '$id'");
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $old_image_path = $row['image']; // Store the old image path
        }

        // If a new image is uploaded
        if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
            $image_name = $_FILES['image']['name'];
            $image_tmp = $_FILES['image']['tmp_name'];
            $image_extension = strtolower(pathinfo($image_name, PATHINFO_EXTENSION));

            $upload_dir = "./uploads/";

            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            // Check if the old image exists and delete it
            if ($old_image_path && file_exists($old_image_path)) {
                unlink($old_image_path); // Delete the old image
            }

            // Move the uploaded file to the server
            $new_image_path = $upload_dir . $image_name;
            if (move_uploaded_file($image_tmp, $new_image_path)) {
                $image_path = $new_image_path;
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to upload image."]);
                exit;
            }
        } else {
            // If no new image is uploaded, use the old image
            $image_path = $old_image_path;
        }

        // Prepare the SQL query to update the resident data
        $sql = "UPDATE residents SET ";

        if ($first_name !== null) $sql .= "first_name='$first_name', ";
        if ($middle_name !== null) $sql .= "middle_name='$middle_name', ";
        if ($last_name !== null) $sql .= "last_name='$last_name', ";
        if ($suffix !== null) $sql .= "suffix='$suffix', ";
        if ($email !== null) $sql .= "email='$email', ";
        if ($gender !== null) $sql .= "gender='$gender', ";
        if ($birth_date !== null) $sql .= "birth_date='$birth_date', ";
        if ($birth_place !== null) $sql .= "birth_place='$birth_place', ";
        if ($age !== null) $sql .= "age='$age', ";
        if ($civil_status !== null) $sql .= "civil_status='$civil_status', ";
        if ($nationality !== null) $sql .= "nationality='$nationality', ";
        if ($religion !== null) $sql .= "religion='$religion', ";
        if ($occupation !== null) $sql .= "occupation='$occupation', ";
        if ($contact !== null) $sql .= "contact='$contact', ";
        $sql .= "pwd='$pwd', ";  // pwd is always either 0 or 1
        if ($education !== null) $sql .= "education='$education', ";
        if ($purok !== null) $sql .= "purok='$purok', ";
        $sql .= "senior_citizen='$senior_citizen'";  // Senior citizen is always 0 or 1

        // Add image path if it exists
        if ($image_path !== null) {
            $sql .= ", image='$image_path' ";
        }

        // Add the WHERE clause
        $sql .= "WHERE resident_id='$id'";

        // Execute the query
        if (mysqli_query($conn, $sql)) {
            echo json_encode(["status" => "success", "message" => "Resident updated successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update resident."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    }
}
