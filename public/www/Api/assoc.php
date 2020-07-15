<?php session_start();
header("Access-Control-Allow-Origin:".$_SERVER['HTTP_CONNECTION']);
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: X-Accept-Charset,X-Accept,Content-Type,Authorization,Accept,Origin,Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Language");

$_POST = json_decode(file_get_contents('php://input'), true); 

if(isset($_POST['call'])) {
    $call = htmlspecialchars(strip_tags($_POST["call"])); 
    switch($call) { 
        case 'getmemberships':
            getMemberships(); 
            break;
        case 'checkyhdistystiedot':
            checkYhdistys(); 
            break;
        case 'joinyhdistys':
            joinYhdistys();
            break;
        case 'checkmember':
            checkMembership();
            break; 
        case 'getallmembers': 
            getAllMembers(); 
            break;
        default:
            http_response_code(404);
    } 
} else {
    http_response_code(400);
}
function getMemberships() {

    $response = array("message"=> "error"); 

    if(isset($_POST["email"])) {
       
        $email = htmlspecialchars(strip_tags($_POST["email"])); 
        $sql= "CALL jasenyydet_getmemberships('$email')";
        $yhteys = connect(); 
        $res = $yhteys->query($sql);
        $rows = []; 
        while($row = mysqli_fetch_assoc($res)) {
            $rows[] = $row; 
        }
        echo json_encode($rows, JSON_UNESCAPED_UNICODE); 
        mysqli_close($yhteys);
        exit();    
    } 
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
function checkYhdistys() {

    $response = array("message"=> "error"); 

    if(isset($_POST["name"]) && isset($_POST["name"])) { 
            $name = htmlspecialchars(strip_tags($_POST["name"])); 
            $yhteys = connect();  

            if($yhteys->multi_query("CALL yhdistys_checkname('$name', @no, @password);SELECT @no as no;SELECT @password as password;")) {
                $yhteys->next_result(); 
                $tulos = $yhteys->store_result(); 
                $lkm = $tulos->fetch_object()->no;

                if($lkm==1) {
                    $yhteys->next_result(); 
                    $tulos = $yhteys->store_result(); 
                    $db_password = $tulos->fetch_object()->password;
                    $tulos->free(); 
                    $password = $name = htmlspecialchars(strip_tags($_POST["password"]));

                    if($db_password == $password) {
                        $response = array("message"=> "Tiedot ovat oikein");
                    } else {
                        $response = array("message"=> "Yhdistyksen nimi tai salasana on väärin");
                        http_response_code(401); 
                    }
                } else {
                    $response = array("message"=> "Yhdistyksen nimi tai salasana on väärin");
                    http_response_code(401); 
                }
            } else{
                $response = array("message"=> "Yhdistyksen haku epäonnistui");
                http_response_code(400); 
            }
    } else {
        $response = array("message"=> "Tietoja puuttuu");
        http_response_code(400); 
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
function joinYhdistys() {

    $response = array("message"=> "error"); 

    if(isset($_POST["email"]) && isset($_POST["yhdistys"]) ) {

            $yhdistys = htmlspecialchars(strip_tags($_POST["yhdistys"])); 
            $yhteys = connect(); 
            $yhdCheck = $yhteys->query("SELECT id FROM yhdistys WHERE name = '$yhdistys'");
            
            if (mysqli_num_rows($yhdCheck)>0){
                $email = htmlspecialchars(strip_tags($_POST["email"])); 
                $role = "member"; // ??? 
                if($yhteys->multi_query("CALL jasenyydet_joinyhdistys('$email','$yhdistys', '$role', @response); SELECT @response as response;")) {
                    $yhteys->next_result(); 
                    $tulos = $yhteys->store_result(); 
                    $res = $tulos->fetch_object()->response;
                    $tulos->free(); 
                    if($res=='true') {
                        $response = array("message"=> "Jäsenyys tallennettu");
                    } else {
                        $response = array("message"=> "Olet jo yhdistyksen $yhdistys jäsen");
                        http_response_code(400);
                    }
                } else {
                    $response = array("message"=> "Jäsenyyden tallentaminen epäonnistui");
                    http_response_code(400); 
                }
            } else {
                $response = array("message"=> "Jäsenyyden tallentaminen epäonnistui. Tarkasta tiedot."); 
                http_response_code(401); 
            }
            
            mysqli_close($yhteys);

    } else {
        $response = array("message"=> "Tietoja puuttuu");
        http_response_code(400); 
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
function checkMembership() { 

    $response = array("message"=> "error"); 

    if(isset($_POST['email']) && isset($_POST['name'])) {
        $email = htmlspecialchars(strip_tags($_POST["email"])); 
        $name = htmlspecialchars(strip_tags($_POST["name"])); 
        $yhteys = connect(); 
        if($yhteys->multi_query("CALL jasenyydet_checkmembership('$email','$name', @no, @role); SELECT @no as no; SELECT @role as role")) {
            $yhteys->next_result(); 
            $tulos = $yhteys->store_result(); 
            $no = $tulos->fetch_object()->no; 
            if($no>0) {
                $yhteys->next_result(); 
                $tulos = $yhteys->store_result(); 
                $role = $tulos->fetch_object()->role; 
                $response = array("message"=> "Jäsen"); 
                $response = array("role"=> "$role"); 
                $tulos->free(); 
            } else {
                $response = array("message"=> "Ei jäsen");
                http_response_code(401); 
            }
        } else {
            $response = array("message"=> "Haku epäonnistui"); 
            http_response_code(400); 
        }
    } 
    echo json_encode($response, JSON_UNESCAPED_UNICODE);

}
function getAllMembers() {

    $response = array("message"=> "error"); 
    if(isset($_POST["yhdistys"])) {
        $yhdistys = htmlspecialchars(strip_tags($_POST["yhdistys"])); 
        $sql= "CALL jasenyydet_getallmembers('$yhdistys')";
        $yhteys = connect(); 
        $res = $yhteys->query($sql);
        $rows = []; 
        while($row = mysqli_fetch_assoc($res)) {
            $rows[] = $row; 
        }
        echo json_encode($rows, JSON_UNESCAPED_UNICODE); 
        mysqli_close($yhteys);
        exit();  
    } 
    echo json_encode($response, JSON_UNESCAPED_UNICODE);

}
function connect() {
    include("../dbdetails.php");
    $yhteys = new mysqli($host, $user, $password, $db) or die("Connection fail ".mysqli_connect_error());
    $yhteys->set_charset("utf8");
    return $yhteys;
}