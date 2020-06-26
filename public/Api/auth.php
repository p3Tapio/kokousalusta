<?php

$_POST = json_decode(file_get_contents('php://input'), true); 

if(isset($_POST['call'])) {
    $call = htmlspecialchars(strip_tags($_POST["call"])); 
    switch($call) { 
        case 'fbreg':
            fbRegistration(); 
            break; 
        case 'fblogin':
            fbLogin(); 
            break;
        case 'appreg':
            appRegistration();
            break; 
        case 'applogin':
            appLogin(); 
            break; 
        default:
            http_response_code(404);
        } 
} else {
    http_response_code(400);
}

function fbRegistration() {
       
    $response = array("message"=> "error"); 

    if(isset($_POST["firstname"]) && isset($_POST["lastname"]) && isset($_POST["email"]) && isset($_POST["fb_id"])) {
            
        $email = htmlspecialchars(strip_tags($_POST['email']));
        $lkm = checkUserEmail($email);
        
        if($lkm==0) {
            
            $firstname = htmlspecialchars(strip_tags($_POST["firstname"])); 
            $lastname = htmlspecialchars(strip_tags($_POST["lastname"])); 
            $fb_id = htmlspecialchars(strip_tags($_POST["fb_id"])); 
            $role = htmlspecialchars(strip_tags($_POST["role"])); 
            $yhteys = connect(); 

            if($yhteys->query("CALL users_fbRegistration ('$firstname', '$lastname',  '$email', '$fb_id')")) {
                $response['message'] = "Käyttäjätili rekisteröity";

            } else {
                $response['message'] = "Rekisteröityminen epäonnistui";
                http_response_code(400);    
            }

            mysqli_close($yhteys);

        } else {
            $response['message'] = "Antamillasi tiedoilla on jo rekisteröity käyttäjätili";
            http_response_code(400);    
        }

    } else {    
        $response = array("message"=> "Rekisteröitymiseen tarvittavia tietoja puuttuu."); 
        http_response_code(400);
    }      
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
function appRegistration() {
  
    $response = array( "message"=> "error" );
    if(isset($_POST["firstname"]) && isset($_POST["lastname"]) && isset($_POST["email"]) && isset($_POST["password"])) {
        $email = htmlspecialchars(strip_tags($_POST['email']));
        $lkm = checkUserEmail($email);
        if($lkm == 0) {
            $firstname = htmlspecialchars(strip_tags($_POST["firstname"])); 
            $lastname = htmlspecialchars(strip_tags($_POST["lastname"])); 
            $password = htmlspecialchars(strip_tags($_POST["password"])); 
            $password_h = password_hash($password, PASSWORD_BCRYPT);

            $yhteys = connect(); 

            if($yhteys->query("CALL users_appRegistration ('$firstname', '$lastname',  '$email', '$password_h')")) {
                $response['message'] = "Käyttäjätili rekisteröity";
            } else {
                $response['message'] = "Rekisteröityminen epäonnistui";
                http_response_code(400);    
            }        

            mysqli_close($yhteys);
        
        } else {
            $response['message'] = "Antamillasi tiedoilla on jo rekisteröity käyttäjätili";
            http_response_code(400);    
        }
    } else {
        $response = array("message"=> "Tietoja puuttuu");
        http_response_code(400); 
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
function fbLogin() {

    $response = array("message"=> "error"); 

    if(isset($_POST["email"]) && isset($_POST["fb_id"])) {
            
            $email = htmlspecialchars(strip_tags($_POST['email']));
            $emailCheck = checkUserEmail($email);

            if($emailCheck == 1) {

                $fb_id = htmlspecialchars(strip_tags($_POST['fb_id']));
                $yhteys = connect(); 

                if($yhteys->multi_query("CALL users_fblogin('$fb_id', @no); SELECT @no as no;")) {

                    $yhteys->next_result(); 
                    $tulos = $yhteys->store_result(); 
                    $lkm = $tulos->fetch_object()->no;
                    $tulos->free();  

                    if($lkm == 1) {                 
                        $token = tokenGen(); 
                        $response = array("message"=> "Kirjautuminen onnistui",  "token"=>"$token");
                    } else {
                        $response = array("message"=> "Väärä käyttäjätunnus tai salasana"); 
                        http_response_code(401); 
                    }
                } else {
                    $response = array("message"=> "Kirjautuminen epäonnistui"); 
                    http_response_code(400); 
                }
                mysqli_close($yhteys);
            } else {
                $response = array("message"=> "Väärä käyttäjätunnus tai salasana"); 
                http_response_code(401); 
            }
    } else {
        $response = array("message"=> "Kirjautuminen epäonnistui");
        http_response_code(400); 
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);

}
function appLogin() {

    $response = array("message"=> "error"); 
    if(isset($_POST["email"]) && isset($_POST["password"])) {
        $email = htmlspecialchars(strip_tags($_POST['email']));
        $emailCheck = checkUserEmail($email);

        if($emailCheck == 1) {

            $yhteys = connect();  
            $password = htmlspecialchars(strip_tags($_POST['password']));

            if($yhteys->multi_query("CALL users_applogin('$email', @password, @firstname, @lastname); SELECT @password as password; SELECT @firstname as firstname; SELECT @lastname as lastname;")) {
                
                $yhteys->next_result(); 
                $tulos = $yhteys->store_result(); 
                $dbpassword = $tulos->fetch_object()->password;

                if(password_verify($password, $dbpassword)) {
    
                    $yhteys->next_result(); 
                    $tulos = $yhteys->store_result(); 
                    $firstname = $tulos->fetch_object()->firstname;

                    $yhteys->next_result(); 
                    $tulos = $yhteys->store_result(); 
                    $lastname = $tulos->fetch_object()->lastname; 
                    
                    $tulos->free();      
                    $token = tokenGen(); 
                    $response = array("message"=> "Kirjautuminen onnistui", "firstname" => "$firstname", "lastname" => "$lastname", "token"=>"$token");

                } else {
                    $response = array("message"=> "Väärä käyttäjätunnus tai salasana"); 
                    http_response_code(401); 
                }
            } else {
                $response = array("message"=> "Kirjautuminen epäonnistui");
                http_response_code(400); 
            }
            mysqli_close($yhteys);
        } else {
            $response = array("message"=> "Väärä käyttäjätunnus tai salasana"); 
            http_response_code(401); 
        }
    } else {
        $response = array("message"=> "Tietoja puuttuu");
        http_response_code(400); 
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
function tokenGen() { 
    $token = openssl_random_pseudo_bytes(16);
    $token = bin2hex($token);
    return $token;
}
function checkUserEmail($email) {

    $yhteys = connect();  

    if($yhteys->multi_query("CALL users_checkEmail('$email', @no); SELECT @no as no;")) {

        $yhteys->next_result(); 
        $tulos = $yhteys->store_result(); 
        $lkm = $tulos->fetch_object()->no;
        $tulos->free();   
        mysqli_close($yhteys);
        return $lkm; 

    } else {
        mysqli_close($yhteys);
        return null; 
    }
}
function connect() {
    $yhteys = new mysqli("localhost", "root", "", "kokous_db") or die("Connection fail ".mysqli_connect_error());
    $yhteys->set_charset("utf8");
    return $yhteys;
}
?>
