<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

  $method = $_SERVER['REQUEST_METHOD'];
  $servername = "142.51.1.106";
  $username = "fsluser";
  $password = "jRXdJUQk";
  $db = "frenchtest";



  $conn = new mysqli($servername, $username, $password, $db);

  if($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
  }

  if($method == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $timeLeft = $data['timeLeft'];
    $id = $data['studentID'];

    $sql = "UPDATE students SET timeLeft=$timeLeft WHERE studentID=$id";

    $result = $conn->query($sql);

  }

?>
