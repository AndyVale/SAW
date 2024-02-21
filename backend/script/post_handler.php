<?php
    require_once "../funzioni/dbFunctions.php";

    
    try{
        if($_SERVER['REQUEST_METHOD'] == 'GET' && !empty($_GET['idUtente'])){//TODO: gestire meglio questo caso particolare
            if(!empty($_GET['idUtente'])){
                $query = "SELECT post.ID, post.oraPubblicazione, post.urlImmagine, post.altDescription, COUNT(liked.idUtente) as likes
                        FROM post LEFT JOIN liked ON post.ID = liked.idPost
                        WHERE post.idUtente = ?
                        GROUP BY post.ID";
                $res = safeQuery($query,array($_GET['idUtente']),"i");
                if(!is_numeric($res)){
                    http_response_code(200);
                    echo json_encode($res);
                }else{
                    http_response_code(500);
                    echo json_encode(array("result" => "ERROR", "message" => "Errore nella query"));
                } 
                exit;
            }
        }
    }
    catch(Exception $e){
        http_response_code(500);
        echo json_encode(array("result" => "ERROR", "message" => "Errore nella query"));
        exit;
    }

    if(!safeSessionStart()){
        http_response_code(401);
        exit;
    }

    $idUtente = $_SESSION['ID'];
try{
    if($_SERVER['REQUEST_METHOD'] == "GET"){
        $query = "SELECT post.ID, post.oraPubblicazione, post.urlImmagine, post.altDescription, COUNT(liked.idUtente) as likes
                  FROM post LEFT JOIN liked ON post.ID = liked.idPost
                  WHERE post.idUtente = $idUtente
                  GROUP BY post.ID";
        $res = standardQuery($query);
        if(!is_numeric($res)){
            http_response_code(200);
            echo json_encode($res);
        }else{
            http_response_code(500);
            echo json_encode(array("result" => "ERROR", "message" => "Errore nella query"));
        }
    }

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        if(empty($_GET['altDescription'])){
            http_response_code(400);
            echo json_encode(array("result" => "ERROR", "message" => "Missing altDescription field"));
            exit;
        }
        $alt = htmlentities($_GET['altDescription']);
        $imageUrlObject = file_get_contents('php://input');
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageUrlObject));

        if($imageData === false) {
            throw new \Exception('base64_decode failed');
        }
        $filename =  uniqid($_SESSION[ID], true).'.png';
        file_put_contents(POST_PATH.$filename, $imageData);
        //file_put_contents('../../frontend/immagini/'.$filename, $imageData);
        
        $imageInfo = getimagesize(POST_PATH.$filename);
        //$imageInfo = getimagesize('../../frontend/immagini/'.$filename);

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
}
catch(Exception $e){
    http_response_code(500);
    echo json_encode(array("result" => "ERROR", "message" => "Errore nella query"));
    exit;
}