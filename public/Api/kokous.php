<?php

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

    if(isset($_POST["name"])) {
        $name = htmlspecialchars(strip_tags($_POST["name"])); 
        $sql= "CALL kokous_getkokoukset('$name')";
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
    
    $response = array( "message"=> "error");
    http_response_code(400);

    if(isset($_POST['id_y']) && isset($_POST['kokousnro']) && isset($_POST['startDate']) && isset($_POST['endDate'])) {
        $id_y = (int)($_POST['id_y']); 
        $otsikko = htmlspecialchars(strip_tags($_POST['otsikko']));
        $kokousnro =  (int)$_POST['kokousnro'];
        $startDate = htmlspecialchars(strip_tags($_POST['startDate'])); 
        $startDate = date('Y-m-d', strtotime($startDate));
        $endDate = htmlspecialchars(strip_tags($_POST['endDate'])); 
        $endDate = date('Y-m-d', strtotime($endDate));

        $sql = "CALL kokous_insert($id_y, '$otsikko', $kokousnro, '$startDate', '$endDate')";
        $yhteys = connect(); 

        if($yhteys->query($sql)) {
            $response['message'] = "Kokous tallennettu";
            http_response_code(200);
        }
        else {
            $response['message'] = "Tapahtui virhe. Tallennus epäonnistui.";
            http_response_code(400);
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

function connect() {

    $yhteys = new mysqli("localhost", "root", "", "kokous_db") or die("Connection fail ".mysqli_connect_error());
    $yhteys->set_charset("utf8");
    return $yhteys;
}
?>
