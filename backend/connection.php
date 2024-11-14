<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


$localhost = "localhost";
$user = "root";
$password = "";
$db = "barangay";


$conn = new mysqli($localhost, $user, $password, $db);