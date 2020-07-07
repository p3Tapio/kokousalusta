<?php
include("mailer.php");

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
        case 'getosallistujat':
            getOsallistujat(); 
            break; 
        case 'poistaosallistuja':
            poistaOsallistuja();
            break; 
        case 'lisaaosallistuja':
            lisaaOsallistuja();
            break; 
        case 'vaihdapvm':
            vaihdaPvm(); 
            break; 
        default:
            http_response_code(404);
    }
} else if (implode(array_column($_POST, 'call')) == 'postosallistujat') {
    postOsallistujat(); 
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
        $rows = []; 
        while($row = mysqli_fetch_assoc($res)) {
            $rows[] = $row; 
        }
        echo json_encode($rows, JSON_UNESCAPED_UNICODE); 
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

        $id = (int)$_POST["id"];
        $yhteys = connect(); 
        $sql= "CALL kokous_getkokous('$id')";
        $res = $yhteys->query($sql);
        $row = mysqli_fetch_assoc($res);
        echo json_encode($row, JSON_UNESCAPED_UNICODE); 
        mysqli_close($yhteys);
        exit(); 

   } else {
        $response = array("message"=> "Tiedot puuttuu");
        http_response_code(400); 
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}

function getKokousNro() {

    $response = array("message"=> "error");

    if(isset($_POST['name'])) {

        $name = htmlspecialchars(strip_tags($_POST['name'])); 
        $yhteys = connect(); 
        
        if($yhteys->multi_query("CALL kokous_getNoId('$name', @no, @id_y); SELECT @no as no; SELECT @id_y as id_y;")) {

            $yhteys->next_result(); 
            $tulos = $yhteys->store_result(); 
            $lkm = $tulos->fetch_object()->no +1; 
            $yhteys->next_result(); 
            $tulos = $yhteys->store_result(); 
            $id_y = $tulos->fetch_object()->id_y; 
            
            $tulos->free();      

            $response['message'] = "Haku onnistui";
            $response['kokousnro'] = $lkm;
            $response['id_y'] = $id_y;

        } else {
            $response['message'] = "Haku epäonnistui";
            http_response_code(400);
        }
        mysqli_close($yhteys);
    } 
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 

}
function luoKokous() {  

    $response = array( "message"=>"Tapahtui virhe. Tallennus epäonnistui.");
    http_response_code(400);

    if(isset($_POST['id_y']) && isset($_POST['kokousnro']) && isset($_POST['startDate']) && isset($_POST['endDate']) && isset($_POST['paatosvaltaisuus'])) {

        $id_y = (int)($_POST['id_y']); 
        $otsikko = strip_tags($_POST['otsikko']);
        $kokousnro =  (int)$_POST['kokousnro'];
        $startDate = htmlspecialchars(strip_tags($_POST['startDate'])); 
        $startDate = date('Y-m-d', strtotime($startDate));
        $endDate = htmlspecialchars(strip_tags($_POST['endDate'])); 
        $endDate = date('Y-m-d', strtotime($endDate));
        $paatosv_esityslista = (int)$_POST['paatosvaltaisuus']['esityslista'];
        $paatosv_aktiivisuus  = (int)$_POST['paatosvaltaisuus']['aktiivisuus'];
        $paatosv_kesto  = (int)$_POST['paatosvaltaisuus']['kesto'];
        $paatosv_muu  = htmlspecialchars(strip_tags($_POST['paatosvaltaisuus']['muu']));

        $sql = "CALL kokous_insert($id_y, '$otsikko', $kokousnro, $paatosv_esityslista, $paatosv_aktiivisuus, $paatosv_kesto, '$paatosv_muu', '$startDate', '$endDate')";
        $yhteys = connect(); 

        if($yhteys->query($sql)) {
            $response['message'] = "Kokous tallennettu";
            http_response_code(200);
        }
        mysqli_close($yhteys);
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function postOsallistujat() {
    
    $response = array( "message"=> "Osallistujien tallennus epäonnistui.");
    http_response_code(400);

    if(isset($_POST[0]['id_y']) && isset($_POST[0]['kokousnro'])) {

        $id_y = (int)$_POST[0]['id_y'];
        $kokousnro =  (int)$_POST[0]['kokousnro'];
        $x = array_shift($_POST);

        foreach($_POST as $item) {
            $role = htmlspecialchars(strip_tags($item['rooli']));
            $email =  htmlspecialchars(strip_tags($item['email']));
            
            $q = "CALL osallistujat_insertosallistujat($id_y, $kokousnro, '$role', '$email')";
            $yhteys = connect(); 
      
            if($yhteys->query($q)) {
                $response = array( "message"=> "Osallistujien tiedot tallennettu.");
                http_response_code(200);
            } else { 
                $response = array( "message"=> "Osallistujien tallennus epäonnistui.");
                http_response_code(400);
            }
            mysqli_close($yhteys);
        }
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function sendKokousInvite() {
    $response = array( "message"=> "Kokouskutsun lähetys epäonnistui.");
    http_response_code(400);
    if(isset($_POST['yhdistys']) && isset($_POST['aihe']) && isset($_POST['viesti']) && isset($_POST["osallistujat"])) {
        $yhdistys = htmlspecialchars(strip_tags($_POST['yhdistys']));
        $aihe = htmlspecialchars(strip_tags($_POST['aihe']));
        $viesti = $_POST['viesti']; 
        $emailerUsername = "";
        $emailerPassword = ""; 

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

function getOsallistujat() {

    $response = array( "message"=> "Osallistujien haku epäonnistui.");
    http_response_code(400);

    if(isset($_POST['id'])) {
        $kokousId = (int)$_POST['id'];
        $q = "CALL osallistujat_getosallistujat($kokousId)";
        $yhteys = connect(); 
       
        $res = $yhteys->query($q);
        $rows = []; 
        while($row = mysqli_fetch_assoc($res)) {
            $rows[] = $row; 
        }
        echo json_encode($rows, JSON_UNESCAPED_UNICODE); 
        http_response_code(200);
        mysqli_close($yhteys);
        exit(); 
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function poistaOsallistuja() { // {"call":"poistaosallistuja","kokousid":"33","email":"esco@mail.com"}
    $response = array( "message"=> "Osallistujan poistaminen epäonnistui.");
    http_response_code(400);

    if(isset($_POST['kokousid']) && isset($_POST['email'])) {
        $kokousid = (int)$_POST['kokousid']; 
        $email = htmlspecialchars(strip_tags($_POST['email']));
        
        $q = "CALL osallistujat_poistaosallistuja($kokousid, '$email')"; 
        $yhteys = connect(); 

        if($yhteys->query($q)) {
            $response = array( "message"=> "Osallistuja poistettu.");
            http_response_code(200);
        }
        mysqli_close($yhteys);
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function lisaaOsallistuja() {   // {"call":"lisaaosallistuja","kokousid":"33","yhdistys":"Kissaklubi","email":"testeri@mail.com"}

    $response = array( "message"=> "Osallistujan lisääminen epäonnistui.");
    http_response_code(400);
    
    if(isset($_POST['kokousid']) && isset($_POST['email']) && isset($_POST['yhdistys'])) {
        $kokousid = (int)$_POST['kokousid']; 
        $yhdistys = htmlspecialchars(strip_tags($_POST['yhdistys']));
        $email = htmlspecialchars(strip_tags($_POST['email']));
       
        $q = "CALL osallistujat_lisaaosallistuja($kokousid, '$email','$yhdistys')"; 
        $yhteys = connect(); 

        if($yhteys->query($q)) {
            $response = array( "message"=> "Osallistuja lisätty.");
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

function connect() {

    $yhteys = new mysqli("localhost", "root", "", "kokous_db") or die("Connection fail ".mysqli_connect_error());
    $yhteys->set_charset("utf8");
    return $yhteys;
}
?>
