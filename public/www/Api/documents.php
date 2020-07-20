<?php session_start();
header("Access-Control-Allow-Origin:".$_SERVER['HTTP_CONNECTION']);
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: X-Accept-Charset,X-Accept,Content-Type,Authorization,Accept,Origin,Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Language");


$_POST = json_decode(file_get_contents('php://input'), true);
if(isset($_POST["call"])) {
    $call = htmlspecialchars(strip_tags($_POST["call"])); 
    switch ($call) {
        case 'postdoc':
            postDocument(); 
            break; 
        case 'getdocuments':
            getDocuments(); 
            break; 
        default: 
            http_response_code(404);
            break;        
    }
} else {
    http_response_code(400);
}

function postDocument() {
    $response = array("message"=> "error");
    if(isset($_POST["id_y"]) && isset($_POST["kokousnro"]) && isset($_POST["type"]) && isset($_POST["content"])) {

        $id_y = (int)$_POST["id_y"];
        $kokousnro = (int)$_POST["kokousnro"];
        $type = htmlspecialchars(strip_tags($_POST["type"]));
        $draft = htmlspecialchars(strip_tags($_POST["draft"]));
        $content = $_POST["content"]; // TODO: Allow <p> and <a> --> echo strip_tags($text, '<p><a>');

        $yhteys = connect();

        if($yhteys->query("CALL documents_insertDocument($id_y, $kokousnro,'$content', '$type', $draft)")) {
            $response = array("message"=> "Asiakirja tallennettu.");
        }  else {
            $response['message'] = "Tapahtui virhe. Tallennus epäonnistui.";
            http_response_code(400);
        }
        mysqli_close($yhteys);
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE); 
}
function getDocuments() {
    /* 
    Vaihda proseduuri "documents_getdocuments" tähän: 
	SELECT * FROM documents WHERE documents.id_k = kokousid;
    */

    $response = array("message"=> "Haku epäonnistui.");
    if(isset($_POST["kokousid"])) {

        $kokousid = (int)$_POST["kokousid"];

        $yhteys = connect();
        $q = "CALL documents_getdocuments($kokousid)";

        $res = $yhteys->query($q);
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
?>