<?php session_start();
header("Access-Control-Allow-Origin:".$_SERVER['HTTP_CONNECTION']);
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: X-Accept-Charset,X-Accept,Content-Type,Authorization,Accept,Origin,Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Language");


$flags = $_SESSION['kokous_flags']=1;
$kohtaflags = $_SESSION['kohta_flags']=1;
$user = $_SESSION['user_id'];
$kokous = $_SESSION['kokous_id'];


include("../connect.php");

if(isset($_POST['otsakkeet'])){
	$kokous = (int)$_POST['otsakkeet'];
	$sql = "CALL esityslista_otsakkeet('$kokous','$user')";
	
	$result = $con -> query($sql);
	while($row = mysqli_fetch_assoc($result)){
	   $rows[] = $row;
	}
	if (!isset($rows)) echo "[]";
	else echo json_encode($rows);
	exit(0);
   
}


else if(isset($_POST['check_valitse'])&& isset($_POST['kohta'])){
	$kohta = (int)$_POST['kohta'];
	$vid = (int)$_POST['check_valitse'];
	$sql = "CALL esityskohta_valitse('$kokous','$user','$kohta','$vid');";
	$result = $con -> query($sql);
	if($row = mysqli_fetch_assoc($result)) echo "[".$row['id'].",".$row['b']."]";
	exit(0);
}




else if(isset($_POST['paatos_valitse'])&& isset($_POST['kohta'])){
	$kohta = (int)$_POST['kohta'];
	$param = (int)$_POST['paatos_valitse'];
	$sql = "CALL esityskohta_muuta_tyyppi('$kohta','$param','$kokous','$user')";
	$result = $con -> query($sql);
	exit(0);
	
}




else if(isset($_POST['check_remove']) && isset($_POST['kohta'])){
	
	$kohta = (int)$_POST['kohta'];
	$vid = (int)$_POST['check_remove'];
	$sql = "CALL esityskohta_valinnat_poista('$kokous','$user','$kohta','$vid');";
	$result = $con -> query($sql);
	exit(0);
}




else if(isset($_POST['check_uusi']) && isset($_POST['kohta'])){
	
	$kohta = (int)$_POST['kohta'];
	$sql = "CALL esityskohta_valinnat_lisaa('$kohta','$kokous','$user')";
	$result = $con -> query($sql);
	exit(0);
}




else if(isset($_POST['avaakohta'])){
	$kohta = (int)$_POST['avaakohta'];
	$sql = "CALL esityskohta_data('$kohta','$kokous');";
	$sql.= "CALL esityskohta_valinnat('$kohta','$kokous');";
	$sql.= "CALL valinnat('$kohta','$kokous','$user');";
	$multi_result = $con -> multi_query($sql);
	$i=0;
	if ($multi_result) {
		do {
			if ($result = $con->store_result()) {
				unset($rows);
				while ($row = mysqli_fetch_assoc($result)) {
					if ($i==2) $rows[] = $row['id'];
					else if ($i==0) $rows[] = $row['data'];
					else $rows[] = $row;			
				}
				$rowsall[$i++][] = (isset($rows))? json_encode($rows):-1;
				$result->free();
			}
		} while ($con->next_result());
		echo json_encode($rowsall);
	} 
	exit(0);
}




else if(isset($_POST['save']) && isset($_POST['id']) && isset($_POST['param']) && isset($_POST['kohta'])){
	$param = $_POST['param'];
	$type = $_POST['save'];
	$id = $_POST['id'];
	$kohta = $_POST['kohta'];
	switch ($type) {
		case "otsake": 
			$sql = "CALL esityskohta_muuta('$id','$param','$user','$kokous'); ";
			break;
		case "check":
			$sql = "CALL esityskohta_valinnat_muuta('$kohta','$id','$param','$user','$kokous');";
			break;
		case "kuvaus":
			$sql = "CALL esityskohta_data_muuta('$kohta','$param','$user','$kokous');";
			break;

		case "mielipide":
			echo "TADA";
			exit(0);
	}
	$result = $con -> query($sql);
	exit(0);
}




else if(isset($_POST['Uusi'])){ 
	$sql = "CALL esityskohta_lisaa('$kokous','$user'); ";
	
} else if (isset($_POST['NODE']) && isset($_POST['KOHDE'])){
		$node = trim($_POST['NODE'],'r');
		$kohde = trim($_POST['KOHDE'],'r');
		$sql = "CALL esityskohta_siirra('$node','$kohde','$kokous');";
		$result = $con -> query($sql);
		exit(0);
} else {
		if(isset($_POST['kokous_id']))
		$kokous = $_SESSION['kokous_id']=$_POST['kokous_id'];		
		$sql = "CALL esityskohdat('$kokous'); ";
 }
  



 $result = $con -> query($sql);
 while($row = mysqli_fetch_assoc($result)){
	$rows[] = $row;
 }




 if (!isset($rows)) echo "[[],[]]";
 else echo json_encode([$rows]);

?>

