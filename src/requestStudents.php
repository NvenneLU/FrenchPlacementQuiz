<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

  $method = $_SERVER['REQUEST_METHOD'];
  $referer = $_SERVER['HTTP_REFERER'];
  //isset($referer)
  if(true) {
    $servername = "142.51.1.106";
    $username = "fsluser";
    $password = "jRXdJUQk";
    $db = "frenchtest";



    $conn = new mysqli($servername, $username, $password, $db);

    if($conn->connect_error) {
      die("Connection Failed: " . $conn->connect_error);
    }
    $conn->query('SET NAMES utf8');


    if($method == 'GET') {

      $sql = "select * from students;";
      $result = $conn->query($sql);

      $resultArr = array();
      while($row = $result->fetch_assoc()) {
        array_push($resultArr, array('progress' => $row['progress'], 'marks' => $row['marks'], 'studentID' => $row['studentID'], 'email' => $row['email'], 'name' => $row['name'], 'class' => $row['class'], 'timeLeft' => $row['timeLeft'], 'adminMod' => $row['adminMod'], 'completeTime' => $row['completeDate']));
      }

      echo json_encode($resultArr);

    } else if($method == 'POST') {
      $data = json_decode(file_get_contents('php://input'), true);
      if($data['type'] == 'admin') {
        $name = $data['student']['name'];
        $email = $data['student']['email'];
        $studentID = $data['student']['studentID'];
        $progress = $data['student']['progress'];
        $marks = $data['student']['marks'];
        $class = $data['student']['class'];
        $timeLeft = $data['student']['timeLeft'];
        $adminMod = $data['student']['adminMod'];

        $sql = "UPDATE students SET name='$name', studentID=$studentID, email='$email', progress=$progress, marks=$marks, class='$class', timeleft=$timeLeft, adminMod=$adminMod WHERE studentID=$studentID";
        $conn->query($sql);
        echo json_encode(array('test' => $sql));
      } else if($data['type'] == 'delete') {
        $studentID = $data['student']['studentID'];
        $sql = "DELETE FROM students WHERE studentID=$studentID";
        $conn->query($sql);
      } else {
        $name = $data['student']['name'];
        $email = $data['student']['email'];
        $studentID = $data['student']['studentID'];
        $progress = $data['student']['progress'];
        $totalQuestion = $data['totalQuestion'];
        $marks = $data['student']['marks'];
        $class = $data['student']['class'];
        $timeLeft = $data['student']['timeLeft'];
        $completeDate = $data['student']['completeTime'];

        $error = "";
        $sql = "select * from students where studentID = $studentID";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        if($row['progress'] == 0 && $progress == 0) {
          if(mysqli_num_rows($result) == 1) {
            $error = "You have already taken this test";
            echo json_encode(array('error' => $error, 'success' => 0));
          } else {
            $sql = "select * from students where email like '$email'";
            $result = $conn->query($sql);
            if(mysqli_num_rows($result) == 1) {
              $error = "Email already taken";
              echo json_encode(array('error' => $error, 'success' => 0));
            } else {
              $sql = "INSERT INTO students (studentID, name, email) VALUES ($studentID, '$name', '$email');";
              $result = $conn->query($sql);

              $error = mysqli_error($conn);
              if($error) {
                echo json_encode(array('error' => $error, 'success' => 0));
              } else {
                echo json_encode(array('error' => "", 'success' => 1));
              }
            }

          }
        } else {
          $sql = "";
          $success = 2;
          if($progress >= $totalQuestion || ($timeLeft <= 0 && isset($timeLeft))) {
            $sql = "UPDATE students SET progress=$progress, marks=$marks, class='$class', adminMod=0, completeDate='$completeDate' WHERE studentID=$studentID";
          } else if($progress != 0){
            $sql = "UPDATE students SET progress=$progress, marks=$marks, adminMod=0 WHERE studentID=$studentID";
            $success = 1;
          }

          $result = $conn->query($sql);

          $error = mysqli_error($conn);
          if($error) {
            echo json_encode(array('error' => $error, 'success' => 0, 'sql' => $sql, 'timeleft' => $timeLeft));
          } else {
            echo json_encode(array('error' => "", 'success' => $success));
          }
        }
      }
    }
  } else {
    echo "Uh? What are you doing here?";
  }

?>
