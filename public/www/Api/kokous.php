<?php session_start();
header("Access-Control-Allow-Origin:".$_SERVER['HTTP_CONNECTION']);
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: X-Accept-Charset,X-Accept,Content-Type,Authorization,Accept,Origin,Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Language");

 
$_POST = json_decode(file_get_contents('php://input'), true); 

if(isset($_POST["call"])) {
    $call = htmlspecialchars(strip_tags($_POST["call"])); 
    switch ($call) {
        case 'getkokoukset':
            getKokoukset(); 
            break; 
        case 'getkokous':
            getKokous();
            break; 
        case 'getkokousdraft':
            getKokousDraft(); 
            break; 
        case 'deletedraft': 
            deleteKokousDraft(); 
            break; 
        case 'kokousnro':
            getKokousNro(); 
            break; 
        case 'luokokous':
            luoKokous();
            break;
        case 'sendkokousinvite':
            sendKokousInvite(); 
            break; 
        case 'openkokous':
            openKokous(); 
            break; 
        case 'vaihdapvm':
            vaihdaPvm(); 
            break; 
        case 'getpaatokset':
            getPaatokset();
            break; 
        case 'paatakokous':
            paataKokous(); 
            break; 
        default:
            http_response_code(404);
    }
} else {
    http_response_code(400);
 }
function getKokoukset() {

    $response = array("message"=> "error");

    if(isset($_POST["yhdistys"]) && isset($_POST["email"])) {

        $yhdistys = htmlspecialchars(strip_tags($_POST["yhdistys"])); 
        $email = htmlspecialchars(strip_tags($_POST["email"])); 
        $sql= "CALL kokous_getkokoukset('$yhdistys', '$email')";
        $yhteys = connect(); 
        $res = $yhteys->query($sql);
        $kokousrows = []; 

        while($row = mysqli_fetch_assoc($res)) {
            $_SESSION['yhdistys'] = "KUKKA"; //$row['y_id']; //PURKKA (settaa joka whilessa)*/
            $kokousrows[] = $row; 
        }

        mysqli_close($yhteys);
        $yhteys = connect(); 
        $i = 0; 
        $pjrows=[]; 

        foreach($kokousrows as $x) {
            $id = $kokousrows[$i]['id']; 
            $sql = "CALL kokous_getpj($id)";
           if($result = $yhteys->query($sql)) {
                while($row = mysqli_fetch_assoc($result)) {
                    if(!in_array($row, $pjrows)) {
                        $pjrows[]=$row;   
                    }     
                }   
           }
           $kokousrows[$i] +=array('puheenjohtaja'=>$pjrows);
           $pjrows = []; 
            $i++;
            mysqli_close($yhteys);
            $yhteys = connect(); 
        }
        echo json_encode($kokousrows, JSON_UNESCAPED_UNICODE); 
        mysqli_close($yhteys);
        exit(); 

    } else {
        $response = array("message"=> "Tiedot puuttuu");
        http_response_code(400); 
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function getKokous() {

    $response = array("message"=> "error");

    if(isset($_POST["id"])) {
        $_SESSION['kokous_id'] = $id = (int)$_POST["id"];
        $yhteys = connect(); 
        $sql= "CALL kokous_getkokous('$id')";
        $res = $yhteys->query($sql);
        $row = mysqli_fetch_assoc($res);
        $today = date('Y-m-d');
        $startDate = $row['startDate'];
        $pv_kesto = $row['pv_kesto'];
        $erotus = (new DateTime($startDate))->diff(new DateTime($today))->days;

        if($pv_kesto <= $erotus) $pv_kesto_toteutunut = "true"; 
        else $pv_kesto_toteutunut = "false"; 

        $row['pv_kesto_toteutunut'] = $pv_kesto_toteutunut;
        echo json_encode($row, JSON_UNESCAPED_UNICODE); 
        mysqli_close($yhteys);
        exit(); 

   } else {
        $response = array("message"=> "Tiedot puuttuu");
        http_response_code(400); 
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function  getKokousDraft() {
    $response = array("message"=> "error");
    http_response_code(400); 

    if(isset($_POST['name'])) {
        $yhdistys = htmlspecialchars(strip_tags($_POST['name']));
        $sql = "CALL kokous_getkokousdraft('$yhdistys')";
        $yhteys = connect(); 

        if($res = $yhteys->query($sql)) {
            $row = mysqli_fetch_row($res);
            if($row[0] == 0) {
                $response = array("message"=> "Ei kesken olevia kokouskutsuja");
            } else {
                $response = array("id"=>$row[0],"id_y"=>$row[1], "otsikko"=>$row[2], "kokousnro"=>$row[3], 
                "pv_esityslista"=>$row[4], "pv_aktiivisuus"=>$row[5], "pv_kesto"=>$row[6], "pv_muu"=>$row[7], 
                "startDate"=>$row[8], "endDate"=>$row[9], "avoinna"=>$row[10], "valmis"=>$row[11], "created"=>$row[12]); 
            }
            mysqli_close($yhteys);
            http_response_code(200);
            echo json_encode($response, JSON_UNESCAPED_UNICODE); 
            exit(); 
        }      
    } else {
        $response = array("message"=> "Tiedot puuttuu");
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}

/**
 *  tuhoaa kokous draftin id:n perusteella
 */
function deleteKokousDraft() {
    $response = array("message"=> "error");
    http_response_code(400); 
    if(isset($_POST['kokousid'])) {
        
        $kokousid = (int)$_POST['kokousid'];
        $sql = "CALL kokous_deletekokousdraft($kokousid,4)"; /* <-- kovakoodattu yhdistysid TODO tarvitaan $_SESSION['yhdistys'] */
        $response = array("message"=> $sql);
        $yhteys = connect(); 
        if($result = $yhteys->query($sql)) {

            mysqli_close($yhteys);
            $response = array("message"=>"delete ok");
            http_response_code(200);
        } 
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}

/**
 *  Ei tee uutta kokousta, haistelee montako kokousta on aikaisemmin kyseisellä yhdistyksellä 
 *  jostain syystä hakee nimen perusteella
 */
function getKokousNro() {

    $response = array("message"=> "error");

    if(isset($_POST['yhdistys'])) {

        $name = htmlspecialchars(strip_tags($_POST['yhdistys'])); 
        $yhteys = connect(); 
        
        if($yhteys->multi_query("CALL kokous_getNoId('$name', @no, @id_y, @id_k); SELECT @no as no; SELECT @id_y as id_y; SELECT @id_k as id_k")) {

            $yhteys->next_result(); 
            $tulos = $yhteys->store_result(); 
            $lkm = $tulos->fetch_object()->no +1; 

            $yhteys->next_result(); 
            $tulos = $yhteys->store_result(); 
            $id_y = $tulos->fetch_object()->id_y; 
            
            $yhteys->next_result(); 
            $tulos = $yhteys->store_result(); 
            $id_k = $tulos->fetch_object()->id_k+1; 

            $tulos->free();      

            $response['message'] = "Haku onnistui";
            $response['kokousnro'] = $lkm;
            $response['id_y'] = $id_y;
            /*$response['id_k'] = $id_k;*/

        } else {
            $response['message'] = "Haku epäonnistui";
            http_response_code(400);
        }
        mysqli_close($yhteys);
    } 
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 

}
function luoKokous() {  // perustiedot ensiki tauluun, sitten muut updatella id:n pohjalta, myös vika tallennus? 
   
    $response = array( "message"=>"Tapahtui virhe. Tallennus epäonnistui.");
    http_response_code(400);
  
    if(isset($_POST['id_y']) && isset($_POST['kokousnro']) && isset($_POST['startDate']) && isset($_POST['endDate']) && isset($_POST['avoinna']) && isset($_POST['paatosvaltaisuus']) && isset($_POST['valmis'])) {
        
        $id_y = (int)($_POST['id_y']); 
        $_SESSION['kokous_id'] = $id_k = (int)($_POST['kokousid']); 
        $otsikko = strip_tags($_POST['otsikko']);
        $kokousnro =  (int)$_POST['kokousnro'];
        $startDate = htmlspecialchars(strip_tags($_POST['startDate'])); 
        $startDate = date('Y-m-d', strtotime($startDate));
        $endDate = htmlspecialchars(strip_tags($_POST['endDate'])); 
        $endDate = date('Y-m-d', strtotime($endDate));
        $avoinna = htmlspecialchars(strip_tags($_POST['avoinna'])); 
        if(!$avoinna) $avoinna="0"; 
        $paatosv_esityslista = (int)$_POST['paatosvaltaisuus']['esityslista'];
        $paatosv_aktiivisuus  = (int)$_POST['paatosvaltaisuus']['aktiivisuus'];
        $paatosv_kesto  = (int)$_POST['paatosvaltaisuus']['kesto'];
        $paatosv_muu  = htmlspecialchars(strip_tags($_POST['paatosvaltaisuus']['muu']));
        $valmis = htmlspecialchars(strip_tags($_POST['valmis']));
        if(!$valmis) $valmis="0"; 
          $sql = "CALL kokous_insert($id_y, $id_k, '$otsikko', $kokousnro, $paatosv_esityslista, $paatosv_aktiivisuus, $paatosv_kesto, '$paatosv_muu', '$startDate', '$endDate',  $avoinna, $valmis)";
    //   echo $sql; 
        $yhteys = connect(); 
        if($result = $yhteys->query($sql)) {
            $row = mysqli_fetch_row($result);
            $id_k = $row[0];
            $response['message'] = "Kokous tallennettu";   
            $response['kokousid'] = $id_k;  
            http_response_code(200);
        }
        mysqli_close($yhteys);
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function sendKokousInvite() {
    include("../mailerdetails.php");
    include("mailer.php"); 
    $response = array( "message"=> "Kokouskutsun lähetys epäonnistui.");
    http_response_code(400);
    if(isset($_POST['yhdistys']) && isset($_POST['aihe']) && isset($_POST['viesti']) && isset($_POST["osallistujat"])) {
        $yhdistys = htmlspecialchars(strip_tags($_POST['yhdistys']));
        $aihe = htmlspecialchars(strip_tags($_POST['aihe']));
        $viesti = $_POST['viesti']; 
    

        foreach($_POST['osallistujat'] as $item) {

            $firstname = htmlspecialchars(strip_tags($item['firstname']));              
            $lastname = htmlspecialchars(strip_tags($item['lastname']));
            $email = htmlspecialchars(strip_tags($item['email']));
            $name = $firstname." ".$lastname;
            
            if(sendEmail($emailerUsername,$emailerPassword,$yhdistys,$email, $name,$aihe, $viesti)) {
                $response = array( "message"=> "Kokouksen tallennus ja kokouskutsun lähetys onnistui.");
                http_response_code(200);
            } else {
                $response = array( "message"=> "Kokouskutsun lähetys epäonnistui.");
                http_response_code(400);
            }
        }
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function openKokous() {
    // {"call":"openkokous","id":"45"}
    $response = array( "message"=> "Kokouksen avaaminen epäonnistui.");
    http_response_code(400);

    if(isset($_POST['id'])) {
        $id = (int)$_POST['id'];
        $q = "CALL kokous_openkokous($id)";
        $yhteys = connect(); 
        if($yhteys->query($q)) {
            $response = array( "message"=> "Kokous on avattu osallistujille");
            http_response_code(200);
        }
        mysqli_close($yhteys);
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);  
}
function vaihdaPvm() {//  body {"call":"vaihdapvm","kokousid":"33","enddate":"2020-08-15T00:00:00.000Z"}

    $response = array( "message"=> "Päivämäärän muuttaminen epäonnistui.");
    http_response_code(400);
    
    if(isset($_POST['kokousid']) && isset($_POST['enddate'])) {
        $kokousid = (int)$_POST['kokousid']; 
        $endDate = htmlspecialchars(strip_tags($_POST['enddate'])); 
        $endDate = date('Y-m-d', strtotime($endDate));

        $q = "CALL kokous_vaihdapaattymispaiva($kokousid, '$endDate')"; 
        $yhteys = connect(); 

        if($yhteys->query($q)) {
            $response = array( "message"=> "Kokouksen päättymispäivämäärä vaihdettu");
            http_response_code(200);
        }
    }
    mysqli_close($yhteys);
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function getPaatokset() { // body {"call":"getpaatokset","kokousid":"405"}
    $response = array( "message"=> "Kokouksen päätöksien haku epäonnistui.");
    http_response_code(400);
    if(isset($_POST['kokousid'])) {
        $kokousid = (int)$_POST['kokousid'];
        $q = "CALL esityskohta_getpaatokset($kokousid);";
        $yhteys = connect(); 
        $res = $yhteys->query($q); 
        $rows = []; 
        while($row = mysqli_fetch_assoc($res)) {
            $rows[] = $row; 
        }
        http_response_code(200); 
        echo json_encode($rows, JSON_UNESCAPED_UNICODE); 
        mysqli_close($yhteys);
        exit(); 
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function paataKokous() {
    $response = array( "message"=> "Kokouksen päättäminen epäonnistui.");
    http_response_code(400);
    if(isset($_POST['kokousid'])) {
        $kokousid = (int)$_POST['kokousid'];
        $q = "UPDATE kokous SET loppu = 1 WHERE id = '$kokousid';";
        $yhteys = connect(); 
        if($yhteys->query($q)) {
            $response = array( "message"=> "Kokouksen on päätetty.");
            http_response_code(200); 
        }
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function connect() {
    include("../dbdetails.php");
    $yhteys = new mysqli($host, $user, $password, $db) or die("Connection fail ".mysqli_connect_error());
    $yhteys->set_charset("utf8");
    return $yhteys;
}
?>
