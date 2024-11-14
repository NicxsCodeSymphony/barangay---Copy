<?php
include "../connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['first_name']) && isset($_FILES['image'])) {
        $first_name = mysqli_real_escape_string($conn, $_POST['first_name']);
        $middle_name = mysqli_real_escape_string($conn, $_POST['middle_name']);
        $last_name = mysqli_real_escape_string($conn, $_POST['last_name']);
        $suffix = mysqli_real_escape_string($conn, $_POST['suffix']);
        $household = mysqli_real_escape_string($conn, $_POST['household']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $gender = mysqli_real_escape_string($conn, $_POST['gender']);
        $birth_date = mysqli_real_escape_string($conn, $_POST['birth_date']);
        $birth_place = mysqli_real_escape_string($conn, $_POST['birth_place']);
        $age = mysqli_real_escape_string($conn, $_POST['age']); 
        $civil_status = mysqli_real_escape_string($conn, $_POST['civil_status']);
        $nationality = mysqli_real_escape_string($conn, $_POST['nationality']);
        $religion = mysqli_real_escape_string($conn, $_POST['religion']);
        $occupation = mysqli_real_escape_string($conn, $_POST['occupation']);
        $contact = mysqli_real_escape_string($conn, $_POST['contact']);
        $pwd = isset($_POST['pwd']) ? 1 : 0;
        $education = mysqli_real_escape_string($conn, $_POST['education']);
        $purok = mysqli_real_escape_string($conn, $_POST['purok']);
        $senior_citizen = isset($_POST['senior_citizen']) ? 1 : 0;

        if ($_FILES['image']['error'] == 0) {
            $image_name = $_FILES['image']['name'];
            $image_tmp = $_FILES['image']['tmp_name'];
            $image_extension = strtolower(pathinfo($image_name, PATHINFO_EXTENSION));

            $upload_dir = "./uploads/";

            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            if (move_uploaded_file($image_tmp, $upload_dir . $image_name)) {
                $image_path = $upload_dir . $image_name;

                $sql = "INSERT INTO residents (first_name, middle_name, last_name, suffix, household, email, gender, birth_date, birth_place, age, civil_status, nationality, religion, occupation, contact, pwd, education, purok, senior_citizen, image)
                        VALUES ('$first_name', '$middle_name', '$last_name', '$suffix', '$household', '$email', '$gender', '$birth_date', '$birth_place', '$age', '$civil_status', '$nationality', '$religion', '$occupation', '$contact', '$pwd', '$education', '$purok', '$senior_citizen', '$image_path')";

                if (mysqli_query($conn, $sql)) {
                    echo json_encode(["status" => "success", "message" => "Official added successfully."]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Failed to add official."]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to upload image."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "No image uploaded or there was an upload error."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    }
}
?>
