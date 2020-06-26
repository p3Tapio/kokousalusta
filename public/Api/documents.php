<?php
    // error_reporting(E_ERROR | E_PARSE);
    // header("access-control-allow-origin:*"); <-- settaa tarkoituksen mukaisesti sitten joskus? 
    // header('Content-type:application/json;charset=utf-8');
    // header('Access-Control-Allow-Methods: POST');
    // -----------------
    // TODO: noi kai pitäs json_encodee noi response viestit .... 
    // TODO: hash in, hash out 
    // TAULUJA SAMILLA
    // esityslista: id, nimi, maara 
    // esityskohta: id, k_id, title, alkaa, loppuu, tekija 
    //  


    if(isset($_GET['call'])) {

        switch($_GET['call']) {
            case 'getdoc':
                getDocument();
                break;
            case 'postdoc':
                postDocument(); 
                break; 
            case 'getalldocs':
                getAllDocs();
                break;
            case 'editdoc':
                editDoc();
                break; 
            case 'deletedoc':
                deleteDoc();
                break; 
            default:
                info();
            } 
    }
    else {
        info(); 
    }


    function getAllDocs() {
        
        $_POST = json_decode(file_get_contents('php://input'), true);

        if(isset($_POST['id'])) {
        
            $id_y = $_POST['id'];
   
            $q = "SELECT * FROM documents WHERE id_y=$id_y";
            $yhteys = connect();
            $tulokset = $yhteys->query($q); 
            
            if(mysqli_num_rows($tulokset) > 0) {
                echo '[';
                for($i = 0; $i < mysqli_num_rows($tulokset); $i++) {
                    echo ($i>0?',':'').json_encode(mysqli_fetch_object($tulokset), JSON_UNESCAPED_UNICODE); 
                }
                echo ']';
            } else {
                echo  "{\"message\":\"Ei dokumentteja\"}"; 
            }
            mysqli_close($yhteys);
        }

    }   
    function getDocument() {
        $response ="";

        if(isset($_GET['id'])) {

            $haku = "\"".$_GET['id']."\"";
            $q = "SELECT * FROM documents where id =".$haku;
            $yhteys = connect();
            $tulokset = $yhteys->query($q);  
            $response = json_encode(mysqli_fetch_object($tulokset), JSON_UNESCAPED_UNICODE); 
              
    
        } else {
            $response =  "{\"message\":\"Haku epäonnistui. Unohditko ID:n?\" }";
            http_response_code(404);
        }

        mysqli_close($yhteys);
        echo $response;

    }
    function postDocument() {
 
        $_POST = json_decode(file_get_contents('php://input'), true);
        $response ="";
        
        if(isset($_POST["content"])) {
            if(strlen($_POST["id_y"])>0 && strlen($_POST["content"])>0 && strlen($_POST["draft"])>0) {

                $id_y =$_POST["id_y"];
                $name = $_POST["name"];
                $content = $_POST["content"];
                $draft =$_POST["draft"];

                $yhteys = connect();  
                $q = "INSERT INTO documents (id_y,name,content,draft)
                VALUES ('$id_y','$name', '$content','$draft')";

                if($yhteys->query($q)) {
                    $response = 
                    "{
                        \"id\":\"id?\"
                        \"message\":\"dokumentti tallennettu.\" 
                    }";
                } else {
                    $response =  
                    "{                   
                        \"id\":\"\"
                        \"message\":\"Tallennus epäonnistui:\n".$yhteys->error."\" 
                    }";
                    http_response_code(500); 
                }
                mysqli_close($yhteys);
            }
        }
     
        echo $response;
    }
    function editDoc() {

        $_POST = json_decode(file_get_contents('php://input'), true);
        $yhteys = connect();  
        $response ="";

        if(isset($_POST["id"]) && strlen($_POST['id'] > 0)) {
            if(isset($_POST["content"]) && strlen($_POST["content"]) > 0) {

                $id = (int)$_POST['id'];
                $content = $_POST['content'];
                $q = "UPDATE documents SET content = '$content' WHERE id = $id"; 

                if($yhteys->query($q)) {
                    $response = 
                    "{
                        \"id\":\"id?\"
                        \"message\":\"dokumentti tallennettu.\" 
                    }";
                } else {
                    $response =  
                    "{                   
                        \"id\":\"\"
                        \"message\":\"Tallennus epäonnistui:\n".$yhteys->error."\" 
                    }";
                    http_response_code(500); 
                }
            }
        } else {
            $response = "{ \"message\":\"Virhe.\"}";
            http_response_code(404);
        }
        echo $response;
        mysqli_close($yhteys);
    }
    function deleteDoc() {
        $_POST = json_decode(file_get_contents('php://input'), true);
        $yhteys = connect();  
        $response ="";
        
        if(isset($_POST["id"]) && strlen($_POST['id'] > 0)) {
            $id = (int)$_POST['id'];
            $q = "DELETE FROM documents WHERE id=".$id;
            if($yhteys->query($q)) {
                $response = 
                "{
                    \"message\":\"dokumentti poistettu.\" 
                }";
            } else {
                $response =  
                "{                   
                    \"message\":\"Poisto epäonnistui:\n".$yhteys->error."\" 
                }";
                http_response_code(500); 
            }
        }
        echo $response;
        mysqli_close($yhteys);
    }

    function connect() {
    
        $yhteys = new mysqli("localhost", "root", "", "kokous_db") or die("Connection fail ".mysqli_connect_error());
        $yhteys->set_charset("utf8");
        return $yhteys;
    }

    function info() {
       
        echo "<br/><strong> Tallenna pöytäkirja</strong>    --  POST:    /kokousapi/documents.php?call=postdoc";
        echo "<br/><br/>JSON:<br/><br/>
        {<br/>
            &nbsp&nbsp\"id_y\": \"####\",<br/>
            &nbsp&nbsp\"content\": \"editorin sisältö\",<br/>
            &nbsp&nbsp\"draft\": \"true/false\"<br/>
        }<br/>
        
        ";
        echo "<br/><br/>-------------------------------------------------------------------------<br/>";
        echo "<br/><strong>Hae kaikki pöytäkirjat</strong> -----   GET:   /kokousapi//documents.php?call=getalldocs";
        echo "<br/><br/>-------------------------------------------------------------------------<br/>";
        echo "<br/><strong>Hae tietty pöytäkirja</strong> -----   GET:   /kokousapi/documents.php?call=getdoc&id=##";
        echo "<br/><br/>-------------------------------------------------------------------------<br/>";
        echo "<br/><strong>Muokkaa doksua</strong> -----    POST:  /kokousapi/documents.php?call=editdoc";
        echo "<br/><br/>JSON:<br/><br/>
        {<br/>
            &nbsp&nbsp\"id\": \"####\",<br/>
            &nbsp&nbsp\"id_y\": \"####\",<br/>
            &nbsp&nbsp\"name\": \"Otsikko\",<br/>
            &nbsp&nbsp\"content\": \"editorin sisältö\",<br/>
            &nbsp&nbsp\"draft\": \"true/false\"<br/>
        }<br/>";
        echo "<br/><br/>-------------------------------------------------------------------------<br/>";
        echo "<br/><strong>Poista doksu</strong> -----   POST:    /kokousapi/documents.php?call=deletedoc";
        echo "<br/><br/>Post JSON:<br/><br/>
        {<br/>
            &nbsp&nbsp\"id\": \"####\",<br/>
        }<br/>";
  
    }
?>