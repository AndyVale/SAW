<?php
    require_once "../funzioni/dbFunctions.php";
    if(!safeSessionStart()){
        http_response_code(401);
        exit;
    }

    $idUtente = $_SESSION['ID'];

    if($_SERVER['REQUEST_METHOD'] == 'POST'){//aggiungo post

        if((empty($_FILES['postImage']['name']))){
            http_response_code(400);
            exit;
        }
        ////////////////////////////////////////////// Questo blocco di codice è da spostare in un'altra funzione

        $img_name = $_FILES['postImage']['name'];
        $tmp_name = $_FILES['postImage']['tmp_name'];
        $img_error = $_FILES['postImage']['error'];
        
        if($img_error === 0){
            $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);//prendo l'estensione
            $img_ex_to_lc = strtolower($img_ex);//in minuscolo
            $allowed_extensions = array("jpg", "jpeg", "png");

            if(in_array($img_ex_to_lc, $allowed_extensions)){
                
                $new_img_name = uniqid($_SESSION[ID], true) . '.' . $img_ex_to_lc;//nuovo nome univoco
                $img_upload_path = "../../frontend/immagini/post/" . $new_img_name;//salvo il percorso
                
                move_uploaded_file($tmp_name, $img_upload_path);//salvo il file
                
            } else {
                http_response_code(400);
                exit;
            }
        }else {
            http_response_code(500);
            exit;
        }
        //////////////////////////////////////////////
        $result = standardQuery("INSERT INTO post (idUtente, urlImmagine) VALUES ($idUtente, '$new_img_name')");
        if($result == 1){
            http_response_code(201);
            echo json_encode(array("result" => "INSERT", "message" => "Post aggiunto correttamente"));
        }else{
            unlink($img_upload_path);//cancello l'immagine
            http_response_code(500);
            echo json_encode(array("result" => "ERROR", "message" => "Errore nell'aggiunta del post"));
        }
    }

    if($_SERVER['REQUEST_METHOD'] == 'DELETE'){//elimino il post

        if(empty($_GET['urlImmagine'])){//la delete la faccio sull'url dell'immagine e l'id dell'utente per evitare che qualcuno si diverta a cancellare i post degli altri
            http_response_code(400);
            exit;
        }
        $query = "DELETE FROM post WHERE idUtente = $idUtente AND urlImmagine = ?";
        if(safeQuery($query, array($_GET['urlImmagine']), "s") == 1){
            unlink("../../frontend/immagini/post/" . $_GET['urlImmagine']);//ATTENZIONE: posso cancellarla in questo modo?La query mi da la certezza che questo $_GET[...] sia safe?
            http_response_code(200);
            echo json_encode(array("result" => "DELETE", "message" => "Post eliminato correttamente"));
        }else{
            http_response_code(500);
            echo json_encode(array("result" => "ERROR", "message" => "Errore nell'eliminazione del post"));
        }
    }

    if($_SERVER['REQUEST_METHOD'] == 'GET'){//prendo i post
        if(!empty($_GET['idPost'])){//se mi viene fornito un post in particolare
            $query = "SELECT * FROM post WHERE ID = ?";
            $result = safeQuery($query, array($_GET['idPost']), "i")[0];
        }
        else{
            if(!empty($_GET['idUtente'])){//se mi viene fornito un utente in particolare allora prendo tutti i suoi post
                $query = "SELECT * FROM post WHERE idUtente = ?";
                $result = safeQuery($query, array($_GET['idUtente']), "i");
            }
            else{//altrimenti prendo tutti i post dell'utente loggato
                $query = "SELECT * FROM post WHERE idUtente = $idUtente";
                $result = standardQuery($query);
            }
        }
        echo json_encode($result);
    }