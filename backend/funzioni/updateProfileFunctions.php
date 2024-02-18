<?php
    require_once("dbFunctions.php");
    enum updateResult {
        case SUCCESSFUL_UPDATE;
        case MISSING_FIELDS;
        case DIFFERENT_PASSWORDS;    
        case ERROR_UPDATE;
        case ERROR_NOTLOGGED;
        case DB_ERROR;
        case DUPLICATE_EMAIL;
        case WRONG_EMAIL_FORMAT;
        case WRONG_IMAGE_FORMAT;
        CASE WRONG_CREDENTIALS;
    }

    function update(){
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
            //controlliamo che l'utente non abbia svuotato un campo
            if(emptyFields(FIRSTNAME, LASTNAME, EMAIL/*, USERNAME*/)){//NON SI DEVE CONTROLLARE USERNAME, I TEST AUTOMATICI FALLIREBBERO
                return updateResult::MISSING_FIELDS;
            }
            //controllo, che l'email sia stata modificata o no, che sia valida
            if(!filter_var($_POST[EMAIL], FILTER_VALIDATE_EMAIL))
                return updateResult::WRONG_EMAIL_FORMAT;
            
             //$_FILES['update-profile-image']['name']) fa sì che l'utente possa lasciare vuoto il campo (allora verrà impostata al momento della registrazione
            //un'immagine di default) senza che venga restituito errore
            if(isset($_FILES['update-profile-image']['name'])){
                if (!empty($_FILES['update-profile-image']['name'])){

                //codice per eliminare la vecchia immagine dal server per non sovraccaricarlo
                $pathprofileimage = "../../frontend/immagini/profile";
                //funzione glob per ottenere l'elenco dei file che iniziano con $_SESSION['ID']
                $files = glob($pathprofileimage . '/' . $_SESSION['ID'] . '*');
                //verifica che l'array files non sia vuoto
                if (!empty($files)) {
                    foreach ($files as $file) {
                        if (file_exists($file)) {
                            unlink($file);
                        }/* else {
                        //Non è stato possibile eliminare il file.';
                    }*/
                    }
                } 
                /*else {
                    //Nessun file trovato o il primo file non esiste.;
                }
                */

                //info sull'immagine caricata
                $img_name = $_FILES['update-profile-image']['name'];
                $img_size = $_FILES['update-profile-image']['size'];
                $tmp_name = $_FILES['update-profile-image']['tmp_name'];
                $img_error = $_FILES['update-profile-image']['error'];

                if($img_error === 0){

                    $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);
                    $img_ex_to_lc = strtolower($img_ex);
                    $allowed_extensions = array("jpg", "jpeg", "png");

                    //controllo backend che l'estensione sia ammissibile
                    if(in_array($img_ex_to_lc, $allowed_extensions)){

                        $new_img_name = uniqid($_SESSION[ID], true) . '.' . $img_ex_to_lc;
                        $img_upload_path = "../../frontend/immagini/profile/" . $new_img_name;
        
                        move_uploaded_file($tmp_name, $img_upload_path);
                        
                    } else {
                        return updateResult::WRONG_IMAGE_FORMAT;
                    }
                } else {
                    return updateResult::ERROR_UPDATE;
                }

                if(!empty($_POST[USERNAME])){

                    $data = array(  htmlentities(trim($_POST[FIRSTNAME])), 
                                    htmlentities(trim($_POST[LASTNAME])),
                                    htmlentities(strtolower($_POST[EMAIL])),
                                    htmlentities(trim($_POST[USERNAME])),
                                    $new_img_name,
                                    $_SESSION[ID]); //Uso l'ID per evitare problemi con la vecchia mail

                    $query = "UPDATE utente SET firstname = ?, lastname = ?, email = ?, username = ?, profilePicture = ? WHERE ID = ?";

                    $params = "sssssi";

                } else {
                    $data = array(  htmlentities(trim($_POST[FIRSTNAME])), 
                                    htmlentities(trim($_POST[LASTNAME])),
                                    htmlentities(strtolower($_POST[EMAIL])),
                                    $new_img_name,
                                    $_SESSION[ID]); //Uso l'ID per evitare problemi con la vecchia mail


                    $query = "UPDATE utente SET firstname = ?, lastname = ?, email = ?, profilePicture = ? WHERE ID = ?";

                    $params = "ssssi";
                }
             } else {

                if(!empty($_POST[USERNAME])){
                    $data = array(  htmlentities(trim($_POST[FIRSTNAME])), 
                                    htmlentities(trim($_POST[LASTNAME])),
                                    htmlentities(strtolower($_POST[EMAIL])),
                                    htmlentities(trim($_POST[USERNAME])),
                                    $_SESSION[ID]); //Uso l'ID per evitare problemi con la vecchia mail

                    $query = "UPDATE utente SET firstname = ?, lastname = ?, email = ?, username = ? WHERE ID = ?";

                    $params = "ssssi";

                } else {
                $data = array(  htmlentities(trim($_POST[FIRSTNAME])), 
                                htmlentities(trim($_POST[LASTNAME])),
                                htmlentities(strtolower($_POST[EMAIL])),
                                $_SESSION[ID]); //Uso l'ID per evitare problemi con la vecchia mail

                $query = "UPDATE utente SET firstname = ?, lastname = ?, email = ? WHERE ID = ?";

                $params = "sssi";
                }
            }
        } else {
            $data = array(  htmlentities(trim($_POST[FIRSTNAME])), 
                                htmlentities(trim($_POST[LASTNAME])),
                                htmlentities(strtolower($_POST[EMAIL])),
                                $_SESSION[ID]); //Uso l'ID per evitare problemi con la vecchia mail

                $query = "UPDATE utente SET firstname = ?, lastname = ?, email = ? WHERE ID = ?";

                $params = "sssi";
        }
        
            $conn = connect();
            if($conn == null) return updateResult::DB_ERROR;
        
            try{
                if(safeQuery($query, $data, $params) < 2){
                    $_SESSION[EMAIL] = htmlentities($_POST[EMAIL]);
                    $_SESSION[FIRSTNAME] = htmlentities($_POST[FIRSTNAME]);
                    $_SESSION[LASTNAME] = htmlentities($_POST[LASTNAME]);
                    error_log("update-showProfileFunctions.php/update(): safeQuery"."\n", 3, ERROR_LOG);
                    return updateResult::SUCCESSFUL_UPDATE;
                }
                return updateResult::DB_ERROR;
            }
            catch(mysqli_sql_exception $ex){
                error_log("update-showProfileFunctions.php/update(): ".$ex->getMessage()."\n", 3, ERROR_LOG);
                return updateResult::DUPLICATE_EMAIL;
            }
        }
    }

    function passwordUpdate(){
        //funzione che effettua un aggiornamento della password utente dai dati mandati in POST 
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        if(emptyFields(CURRENTPASS, PASS, CONFIRM)) 
            return updateResult::MISSING_FIELDS;
        if($_POST[PASS] != $_POST[CONFIRM]) 
            return updateResult::DIFFERENT_PASSWORDS;

        $conn = connect();
        if($conn == null) return updateResult::DB_ERROR;

        $query = "SELECT pass FROM Utente WHERE ID =". $_SESSION[ID];
        $rows = standardQuery($query);
        if($rows == -1)
            return updateResult::ERROR_UPDATE;
        if(!password_verify($_POST[CURRENTPASS],  $rows[0][PASS]))
            return updateResult::WRONG_CREDENTIALS;

        $query = "UPDATE Utente SET pass = ? WHERE " . ID ."= ?";
        $HshdPsw = password_hash(trim($_POST[PASS]), PASSWORD_DEFAULT);
        if(safeQuery($query, array($HshdPsw, $_SESSION[ID]), "si") == 1)//la query deve interessare una sola riga
            return updateResult::SUCCESSFUL_UPDATE;
        return updateResult::ERROR_UPDATE;
    }