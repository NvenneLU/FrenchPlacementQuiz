<?php
	header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
	header('Access-Control-Allow-Origin: *');


	session_start();

	$method = $_SERVER['REQUEST_METHOD'];
  $referer = $_SERVER['HTTP_REFERER'];


	if(!isset($referer)) {
		echo json_encode(array("error" => 'What are you doing here'));
		exit();
	}

	if($method != 'POST') {
		echo json_encode(array("error" => 'Wrong method'));
		exit();
	}

	$data = json_decode(file_get_contents('php://input'), true);
	$user = $data["id"];
	$pass = $data["pass"];
	$err = 0;

	if($user == "Renee" && $pass == 'ReneeTest') {
		echo json_encode(array('error' => "", 'success' => 1, "user" => $user, "id" => "0123456"));

		exit();
	}




	if(isset($user) && isset($pass))
		bindEdir($user,$pass);


	function saveLogin($user, $colleagueID){

		$_SESSION["uname"] = $user;

		echo json_encode(array('error' => "", 'success' => 1, "user" => $user, "id" => $colleagueID));

		exit();

	}

	function bindEdir($user,$pass){
	  $ldap_server = "142.51.1.6";
	  $ldap_server_port = "389";
		$userLdap = "cn=ldapweb,o=lul";
		$pass1="!luldap2017!";



		$user2 ='cn='.$user.',ou=std,o=LUL';
		$connect = @ldap_connect($ldap_server,$ldap_server_port) or die(ldap_error() . "");
		if($connect) {
			$bind = @ldap_bind($connect,$user2,$pass);

			if($bind == 1) {
				$sr = ldap_search($connect, "o=LUL" , "(&(objectClass=person)(cn=$user))",array("lulColleagueId","dn"));
				$info = ldap_get_entries($connect, $sr);

				if($info['count'] == 0){
	        echo json_encode(array("error" => 'No such user', 'success' => 0));
	       	// exit();
	      }

	      $ou = explode( "," , ($info[0]['dn']) );
	      $context = explode("=" , $ou[1]);


				if(isset($info[0]['lulcolleagueid'][0])) {

					$colleagueID = $info[0]['lulcolleagueid'][0];
					saveLogin($user, $colleagueID);


				} else {

					$err = 2;

				}
	  	}


		} else {
	    echo json_encode(array("error" => 'Problem Connecting', 'success' => 0));
	  }

		if($err == 0)
		 	echo json_encode(array("error" => 'Incorrect Username or password', 'success' => 0));
		else if($err == 2 )
			echo json_encode(array("error" => 'Missing id', 'success' => 0));

	}
?>
