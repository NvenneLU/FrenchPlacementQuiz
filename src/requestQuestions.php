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

      $resultArr = [];

      $sql = "select * from questionp1";
      $result = $conn->query($sql);

      $q1 = [];
      while($row = $result->fetch_assoc()) {
        array_push($q1, array('num' => $row['id'], 'audioFile' => $row['audioFile'], 'correct' => $row['correct'], 'marks' => $row['marks']));
      }
      array_push($resultArr, $q1);

      $sql1 = "select * from (questionp2 q2 inner join statements s on q2.id = s.questionID);";
      $result1 = $conn->query($sql1);

      $statements = [];
      $answers = [];
      $correct = [];
      $marks = [];
      $q2 = [];
      while($row = $result1->fetch_assoc()) {
        array_push($statements, $row['statement']);
        array_push($answers, array($row['answer1'], $row['answer2'], $row['answer3'], $row['answer4']));
        array_push($correct, $row['correct']);
        array_push($marks, $row['marks']);
        if($row['statementID'] == 4) {
          array_push($q2, array('num' => $row['id'], 'audioFile' => $row['audioFile'], 'marks' => $marks, 'statements' => $statements, 'statementAnswers' => $answers, 'correct' => $correct ));
          $statements = [];
          $answers = [];
          $correct = [];
          $marks = [];
        }
      }
      array_push($resultArr, $q2);

      $sql = "select * from questionp3;";
      $result = $conn->query($sql);

      $q3 = [];
      while($row = $result->fetch_assoc()) {
        $options = array($row['option1'], $row['option2'], $row['option3'], $row['option4']);
        array_push($q3, array('num' => $row['id'], 'audioFile' => $row['audioFile'], 'text' => $row['text'], 'options' => $options, 'correct' => $row['correct'], 'marks' => $row['marks']));
      }
      array_push($resultArr, $q3);

      $sql = "select * from (questionp4 q4 inner join options op on q4.id = op.questionID);";
      $result = $conn->query($sql);

      $q4 = [];
      $options = [];
      $correct = [];
      $marks = [];
      while($row = $result->fetch_assoc()) {
        array_push($options, array($row['option1'], $row['option2'], $row['option3'], $row['option4']));
        array_push($correct, $row['correct']);
        array_push($marks, $row['marks']);

        if($row['optionID'] == $row['numQuestions']) {
          array_push($q4, array('num' => $row['id'], 'audioFile' => $row['audioFile'], 'marks' => $marks, 'text' => $row['text'], 'options' => $options, 'correct' => $correct, 'title' => $row['title']));
          $options = [];
          $correct = [];
          $marks = [];
        }
      }

      array_push($resultArr, $q4);



      echo json_encode($resultArr);

    } else if($method == 'POST') {
      $data = json_decode(file_get_contents('php://input'), true);
      $part = $data['part'];
      $temp = "test ";
      if($data['type'] == 'delete') {
        if($data['part'] == 1) {
          $qID = $data['question']['num'];
          $sql = "DELETE FROM questionp1 WHERE id=$qID";
          $conn->query($sql);

          $sql = "SELECT * FROM questionp1 WHERE id > $qID";
          $result = $conn->query($sql);


          while($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $newID = $id - 1;

            $sql = "UPDATE questionp1 SET id=$newID WHERE id=$id";
            $conn->query($sql);

          }
        } else if($data['part'] == 2) {
          $qID = $data['question']['num'];
          $sql = "DELETE FROM questionp2 WHERE id=$qID";
          $conn->query($sql);
          $sql = "DELETE FROM statements WHERE questionID=$qID";
          $conn->query($sql);

          $sql = "SELECT * FROM questionp2 WHERE id > $qID";
          $result = $conn->query($sql);

          while($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $newID = $id - 1;

            $sql = "UPDATE questionp2 SET id=$newID WHERE id=$id";
            $conn->query($sql);

          }

          $sql = "SELECT * FROM statements WHERE questionID > $qID";
          $result = $conn->query($sql);

          while($row = $result->fetch_assoc()) {
            $id = $row['questionID'];
            $newID = $id - 1;

            $sql = "UPDATE statements SET questionID=$newID WHERE questionID=$id";
            $conn->query($sql);
          }

        } else if($data['part'] == 3) {
          $qID = $data['question']['num'];
          $sql = "DELETE FROM questionp3 WHERE id=$qID";
          $conn->query($sql);

          $sql = "SELECT * FROM questionp3 WHERE id > $qID";
          $result = $conn->query($sql);

          while($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $newID = $id - 1;

            $sql = "UPDATE questionp3 SET id=$newID WHERE id=$id";
            $conn->query($sql);

          }
        } else if($data['part'] == 4) {
          $qID = $data['question']['num'];
          $sql = "DELETE FROM questionp4 WHERE id=$qID";
          $conn->query($sql);
          $sql = "DELETE FROM options WHERE questionID=$qID";
          $conn->query($sql);

          $sql = "SELECT * FROM questionp4 WHERE id > $qID";
          $result = $conn->query($sql);

          while($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $newID = $id - 1;

            $sql = "UPDATE questionp4 SET id=$newID WHERE id=$id";
            $conn->query($sql);

          }

          $sql = "SELECT * FROM options WHERE questionID > $qID";
          $result = $conn->query($sql);

          while($row = $result->fetch_assoc()) {
            $id = $row['questionID'];
            $newID = $id - 1;

            $sql = "UPDATE options SET questionID=$newID WHERE questionID=$id";
            $conn->query($sql);
          }
        }




      } else {
        if($part == 1) {
          $audioFile = $data['question']['audioFile'];
          $correct = $data['question']['correct'];
          $marks = $data['question']['marks'];
          $num = $data['question']['num'];

          $sql = "INSERT INTO questionp1 (audioFile, correct, marks, id) VALUES ('$audioFile', $correct, $marks, $num) ON DUPLICATE KEY UPDATE id = $num, correct = $correct, marks = $marks, audioFile = '$audioFile'";
          $result = $conn->query($sql);
          echo json_encode(mysqli_error($conn));

        } else if($part == '2') {
          $audioFile = $data['question']['audioFile'];
          $num = $data['question']['num'];
          $marks = $data['question']['marks'];
          $statements = $data['question']['statements'];
          $answers = $data['question']['statementAnswers'];
          $corrects = $data['question']['correct'];

          $sql = "INSERT INTO questionp2 (audioFile, id) VALUES ('$audioFile', $num) ON DUPLICATE KEY UPDATE  audioFile = '$audioFile'";
          $result = $conn->query($sql);

          $error = "";
          for($i = 0; $i < 4; $i++) {
            $statement = $statements[$i];
            $mark = $marks[$i];
            $answer1 = $answers[$i][0];
            $answer2 = $answers[$i][1];
            $answer3 = $answers[$i][2];
            $answer4 = $answers[$i][3];
            $correct = $corrects[$i];
            $id = $i + 1;




            $sql = "INSERT INTO statements (questionID, statementID, statement, answer1, answer2, answer3, answer4, correct, marks) VALUES ($num, $id, '$statement', '$answer1', '$answer2', '$answer3', '$answer4', $correct, $mark) ON DUPLICATE KEY UPDATE statement = '$statement', answer1 = '$answer1', answer2 = '$answer2', answer3 = '$answer3', answer4 = '$answer4', correct = $correct, marks = $mark;";
            $result = $conn->query($sql);

          }

        } else if($part == '3') {

          $audioFile = $data['question']['audioFile'];
          $num = $data['question']['num'];
          $marks = $data['question']['marks'];
          $text = $data['question']['text'];
          $option1 = $data['question']['options'][0];
          $option2 = $data['question']['options'][1];
          $option3 = $data['question']['options'][2];
          $option4 = $data['question']['options'][3];
          $correct = $data['question']['correct'];

          $sql = "INSERT INTO questionp3 (id, audioFile, `text`, option1, option2, option3, option4, correct, marks) VALUES ($num, '$audioFile', '$text', '$option1', '$option2', '$option3', '$option4', $correct, $marks) ON DUPLICATE KEY UPDATE audioFile = '$audioFile', `text` = '$text', option1 = '$option1', option2 = '$option2', option3 = '$option3', option4 = '$option4', correct = $correct, marks = $marks";
          $result = $conn->query($sql);
          $error = mysqli_error($conn);
          echo json_encode(array('test' => $sql, 'error' => $error));


        } else if($part == '4') {
          $audioFile = $data['question']['audioFile'];
          $marks = $data['question']['marks'];
          $text = $data['question']['text'];
          $options = $data['question']['options'];
          $corrects = $data['question']['correct'];
          $num = $data['question']['num'];
          $title = $data['question']['title'];
          $count = count($options);

          $error = "";
          $sql1 = "INSERT INTO questionp4 (id, audioFile, `text`, numQuestions, `title`) VALUES ($num, '$audioFile', '$text', $count, '$title') ON DUPLICATE KEY UPDATE audioFile = '$audioFile', `text` = '$text', numQuestions = $count, `title` = '$title';";
          $result = $conn->query($sql1);
          $error = mysqli_error($conn);
          $sql = "";
          for($i = 0; $i < $count; $i++) {
            $id = $i + 1;
            $option1 = $options[$i][0];
            $option2 = $options[$i][1];
            $option3 = $options[$i][2];
            $option4 = $options[$i][3];
            $correct = $corrects[$i];
            $mark = $marks[$i];

            $sql = "INSERT INTO options (questionID, optionID, option1, option2, option3, option4, correct, mark) VALUES ($num, $id, '$option1', '$option2', '$option3', '$option4', $correct, $mark) ON DUPLICATE KEY UPDATE option1 = '$option1', option2 = '$option2', option3 = '$option3', option4 = '$option4', correct = $correct, mark = $mark;";
            $result = $conn->query($sql);
           }

           echo json_encode(array('test' => $sql, 'test1' => $sql1, 'error' => $error));
        }
      }
    }
  } else {
    echo "Uh? What are you doing here?";
  }



?>
