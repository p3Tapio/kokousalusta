<?php session_start();
header("Access-Control-Allow-Origin:".$_SERVER['HTTP_CONNECTION']);
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: X-Accept-Charset,X-Accept,Content-Type,Authorization,Accept,Origin,Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Language");


$flags = $_SESSION['kokous_flags']=1;
$kohtaflags = $_SESSION['kohta_flags']=1;
$user = $_SESSION['user_id'];
$sql = 0;

include("../connect.php");
if(isset($_POST['hae_kommentit'])){
	$kokous = (int)$_POST['kokous_id'];
	$thread = $_POST['thread'];
	$kohta = $_POST['kohta'];
	$sql = "CALL esityskohta_kommentit('$kohta','$thread','$user','$kokous')";
}

else if(isset($_POST['otsakkeet'])){
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

else if(isset($_POST['poista_kohta']) && isset($_POST['kokous_id'])) {
	
	$kokous = (int)$_POST['kokous_id'];
	$kohta = (int)$_POST['poista_kohta'];
	$sql = "CALL esityskohta_poista('$kokous','$user','$kohta')";

}


else if(isset($_POST['check_valitse'])&& isset($_POST['kohta']) && isset($_POST['kokous_id']) && isset($_POST['multi'])){
	$kokous = (int)$_POST['kokous_id'];
	$multi = (int)$_POST['multi'];
	$kohta = (int)$_POST['kohta'];
	$vid = (int)$_POST['check_valitse'];
	$sql = "CALL esityskohta_valitse('$kokous','$user','$kohta','$vid','$multi');";
	$result = $con -> query($sql);
	if($row = mysqli_fetch_assoc($result)) echo "[".$row['id'].",".$row['b']."]";
	exit(0);
}




else if(isset($_POST['paatos_valitse'])&& isset($_POST['kohta']) && isset($_POST['kokous_id'])){
	$kokous = (int)$_POST['kokous_id'];
	$kohta = (int)$_POST['kohta'];
	$param = (int)$_POST['paatos_valitse'];
	$sql = "CALL esityskohta_muuta_tyyppi('$kohta','$param','$kokous','$user')";

	
}




else if(isset($_POST['check_remove']) && isset($_POST['kohta']) && isset($_POST['kokous_id'])){
	$kokous = (int)$_POST['kokous_id'];
	$kohta = (int)$_POST['kohta'];
	$vid = (int)$_POST['check_remove'];
	$sql = "CALL esityskohta_valinnat_poista('$kokous','$user','$kohta','$vid');";
	$result = $con -> query($sql);
	exit(0);
}

			


else if(isset($_POST['check_uusi']) && isset($_POST['kohta']) && isset($_POST['kokous_id'])){
	$kokous = (int)$_POST['kokous_id'];
	$data = strip_tags($_POST['check_uusi']);
	$kohta = (int)$_POST['kohta'];
	
	$sql = "CALL esityskohta_valinnat_lisaa('$kohta','$kokous','$user','$data')";
/*	$file = fopen("mitaihmetta","w");
	echo fwrite($file,$sql);
	fclose($file);*/

	$result = $con -> query($sql);
	/*echo $sql;
	*/
	exit(0);
}




else if(isset($_POST['avaakohta']) && isset($_POST['kokous_id'])){
	$kokous = (int)$_POST['kokous_id'];
	$kohta = (int)$_POST['avaakohta'];
	$sql = "CALL esityskohta_data('$kohta','$kokous');";
	$sql.= "CALL esityskohta_valinnat('$kohta','$kokous',$user);";
	$sql.= "CALL valinnat('$kohta','$kokous','$user');";
	$sql.= "CALL esityskohta_mielipiteet('$kohta','$kokous','$user');";
	$multi_result = $con -> multi_query($sql);
	$i=0;
	if ($multi_result) {
		do {
			if ($result = $con->store_result()) {
				unset($rows);
				while ($row = mysqli_fetch_assoc($result)) {
					if (isset($row['-1']));
					else if ($i==2) $rows[] = $row['id'];
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




else if(isset($_POST['save']) && isset($_POST['thread']) && isset($_POST['param']) && isset($_POST['kohta']) && isset($_POST['kokous_id'])){
	$kokous = (int)$_POST['kokous_id'];
	$param = addslashes($_POST['param']);
	$type = $_POST['save'];
	$thread = $_POST['thread'];
	$kohta = $_POST['kohta'];

	switch ($type) {
		case "otsake": 
			$sql = "CALL esityskohta_muuta('$thread','$param','$user','$kokous'); ";
			break;
		case "check":
			$sql = "CALL esityskohta_valinnat_muuta('$kohta','$thread','$param','$user','$kokous');";
			break;
		case "kuvaus":
			$sql = "CALL esityskohta_data_muuta('$kohta','$param','$user','$kokous');";
			break;
		case "mielipide":
			if (isset($_POST['alku']) && isset($_POST['loppu']) && isset($_POST['draft'])){
				$draft = $_POST['draft'];
				$alku = $_POST['alku'];
				$loppu = $_POST['loppu'];
				$sql = "CALL esityskohta_mielipide_lisaa('$kohta','$kokous','$user','$draft','$alku','$loppu','$param')";
				}

			break;
		case "paatos":
			if (isset($_POST['tila'])){
				$tila = $_POST['tila'];
				$sql = "CALL esityskohta_paatos_muuta('$kohta','$kokous','$user','$param','$tila')";} 	
			break;
		case "kommentti_mielipide":
				$sql = "CALL esityskohta_kommentoi_mielipide('$kohta','$kokous','$user','$thread','$param')";
				echo $sql;

			break;
			
	}
	if ($sql !== 0)
	$con -> query($sql);
	exit(0);
}





else if(isset($_POST['Uusi']) && isset($_POST['kokous_id'])){
	$kokous = (int)$_POST['kokous_id']; 
	$sql = "CALL esityskohta_lisaa('$kokous','$user'); ";
	
} else if (isset($_POST['NODE']) && isset($_POST['KOHDE']) && isset($_POST['kokous_id'])){
	$kokous = (int)$_POST['kokous_id'];
		$node = trim($_POST['NODE'],'r');
		$kohde = trim($_POST['KOHDE'],'r');
		$sql = "CALL esityskohta_siirra('$node','$kohde','$kokous');";
		$result = $con -> query($sql);
		exit(0);
} else {
		if(isset($_POST['kokous_id'])){
			$kokous = (int)$_POST['kokous_id']; 
			$sql = "CALL esityskohdat('$kokous'); ";
		} else 
		{
			exit();
		}
		
		
 }
  
if ($sql === 0) exit(0);


 $result = $con -> query($sql);
 while($row = mysqli_fetch_assoc($result)){
	$rows[] = $row;
 }




 if (!isset($rows)) echo "[[],[]]";
 else echo json_encode([$rows]);

?>

