<?php


  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

  $method = $_SERVER['REQUEST_METHOD'];
  $referer = $_SERVER['HTTP_REFERER'];
  //isset($referer)
  if(true) {
    if($method == 'GET') {
      $json = file_get_contents("./testConfig.json");
      echo $json;

    } else if($method == 'POST') {
      $json = file_get_contents("./testConfig.json");

      $config = json_decode($json, true);

      $data = json_decode(file_get_contents('php://input'), true);

      $median = $data['medianMark'];
      $quizTime = $data['quizTime'];

      $config['medianMark'] = $median;
      $config['questionTime'][0] = $data['questionTime'][0];
      $config['questionTime'][1] = $data['questionTime'][1];
      $config['questionTime'][2] = $data['questionTime'][2];
      $config['questionTime'][3] = $data['questionTime'][3];
      $config['quizTime'] = $quizTime;
      $config['test'] = $data['test'];

      $error = file_put_contents("./testConfig.json", json_encode($config));

      echo json_encode($error);
    }
  } else {
    echo "Uh? What are you doing here?";
  }



 ?>
