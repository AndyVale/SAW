<?php
    require_once "../funzioni/dbFunctions.php";
    if(!safeSessionStart()){
        http_response_code(401);
        exit;
    }
    
    $idUtente = $_SESSION['ID'];
try{
    if($_SERVER['REQUEST_METHOD'] == 'POST'){//aggiungo post
        ////////////////////////////////////////////// Questo blocco di codice è da spostare in un'altra funzione
        if(empty($_GET['altDescription'])){
            http_response_code(400);
            echo json_encode(array("result" => "ERROR", "message" => "Missing altDescription field"));
            exit;
        }
        $alt = $_GET['altDescription'];
        $imageUrlObject = file_get_contents('php://input');
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageUrlObject));

        if($imageData === false) {
            throw new \Exception('base64_decode failed');
        }
        $filename =  uniqid($_SESSION[ID], true).'.png';
        //file_put_contents(POST_PATH.$filename, $imageData);
        file_put_contents('../../frontend/immagini/'.$filename, $imageData);
        
        //$imageInfo = getimagesize(POST_PATH.$filename);
        $imageInfo = getimagesize('../../frontend/immagini/'.$filename);

        if($imageInfo['mime'] != 'image/png') {//se non era un immagine cancello il casino appena fatto
            echo $imageInfo['mime'];
            file_put_contents($filename, "");
            if(unlink($filename))
                echo 'Image deleted successfully<br>';
            else
                echo 'Image deletion failed<br>';
            http_response_code(400);
            exit;
        }
        
        //////////////////////////////////////////////
        $result = standardQuery("INSERT INTO post (idUtente, urlImmagine, altDescription) VALUES ($idUtente, '$filename','$alt')");
        if($result == 1){
            http_response_code(201);
            echo json_encode(array("result" => "INSERT", "message" => "Post aggiunto correttamente"));
        }else{
            if(unlink($filename))
                echo 'Image deleted successfully<br>';
            else
                echo 'Image deletion failed<br>';
            http_response_code(500);
            echo json_encode(array("result" => "ERROR", "message" => "Errore nell'aggiunta del post"));
        }
    }

    if($_SERVER['REQUEST_METHOD'] == 'DELETE'){//elimino il post
        echo $_GET['idPost'];
        if(empty($_GET['idPost'])){//la delete la faccio sull'url dell'immagine e l'id dell'utente per evitare che qualcuno si diverta a cancellare i post degli altri
            http_response_code(400);
            exit;
        }
        $query = "DELETE FROM post WHERE idUtente = $idUtente AND ID = ?";
        echo $query;
        if(safeQuery($query, array($_GET['idPost']), "i") == 1){
           // unlink("../../frontend/immagini/post/" . $_GET['ID']);//ATTENZIONE: posso cancellarla in questo modo?La query mi da la certezza che questo $_GET[...] sia safe?
            echo json_encode(array("result" => "DELETE", "message" => "Post eliminato correttamente"));
            http_response_code(205);
        }else{
            echo json_encode(array("result" => "ERROR", "message" => "Errore nell'eliminazione del post"));
            http_response_code(500);
        }
    }

    if($_SERVER['REQUEST_METHOD'] == 'GET'){//prendo i post
        /*if(!empty($_GET['idPost'])){//se mi viene fornito un post in particolare
            $query = "SELECT * FROM post WHERE ID = ?";
            
            $result = safeQuery($query, array($_GET['idPost']), "i");
            if(count($result) == 1){
                http_response_code(200);
                echo json_encode($result[0]);
            }
        }*/
        //else{
            if(!empty($_GET['idUtente'])){//se mi viene fornito un utente in particolare allora prendo tutti i suoi post
                $query = "SELECT * FROM post WHERE idUtente = ?";
                $result = safeQuery($query, array($_GET['idUtente']), "i");
                //if(count($result) == 0){
                //    http_response_code(404);
                //    echo json_encode(array("result" => "ERROR", "message" => "Nessun post trovato"));
                //}
                //else
                //   http_response_code(200);
            }
            else{//altrimenti prendo tutti i post dell'utente loggato
                $query = "SELECT * FROM post WHERE idUtente = $idUtente";
                $result = standardQuery($query);
            }
        //}
        echo json_encode($result);
    }
}
catch(Exception $e){
    http_response_code(500);
    echo json_encode(array("result" => "ERROR", "message" => "Errore nella query"));
    exit;
}