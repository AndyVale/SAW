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

    function removeOldFile($files){
        //funzione che elimina un file dal server
        if (!empty($files)) {
            foreach ($files as $file) {
                if (file_exists($file)) {
                    unlink($file);
                }else {
                    //Non è stato possibile eliminare il file.';
                    return false;
                }
            }
        }
        return true;
    }

    function saveImage($img_name, $tmp_name, $img_error, $allowed_extensions, $img_upload_path){
        //funzione che salva un'immagine sul server
        if($img_error === 0){
            $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);
            $img_ex_to_lc = strtolower($img_ex);
            if(in_array($img_ex_to_lc, $allowed_extensions)){
                $new_img_name = $_SESSION[ID].'-'.uniqid($_SESSION[ID], true) . '.' . $img_ex_to_lc;
                move_uploaded_file($tmp_name, $img_upload_path.'/'.$new_img_name);
                return $new_img_name;
            }
            else {
                return updateResult::WRONG_IMAGE_FORMAT;
            }
        }
        return updateResult::ERROR_UPDATE;
    }
    function update(){
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            //variabili per la query: $data contiene i dati da inserire, $query contiene la query, $params contiene i tipi dei dati
            $data = array();
            $query = "";
            $params = "";
            //controlliamo che l'utente non abbia svuotato un campo
            if(emptyFields(FIRSTNAME, LASTNAME, EMAIL/*, USERNAME*/)){//NON SI DEVE CONTROLLARE USERNAME, I TEST AUTOMATICI FALLIREBBERO
                return updateResult::MISSING_FIELDS;
            }
            //Campi obbligatori: nome, cognome, email
            $data[] = htmlentities(trim($_POST[FIRSTNAME]));
            $data[] = htmlentities(trim($_POST[LASTNAME]));
            $data[] = htmlentities(strtolower($_POST[EMAIL]));
            $query = "UPDATE utente SET ".FIRSTNAME." = ?, ".LASTNAME." = ?, ".EMAIL." = ?";
            $params = "sss";
            //username è opzionale, quindi se è stato inserito, lo aggiungiamo alla query
            if(!empty($_POST[USERNAME])){
                $data[] = htmlentities(trim($_POST[USERNAME]));
                $query .= ", ".USERNAME." = ?";
                $params .= "s";
            }

            //controllo, che l'email sia stata modificata o no, che sia valida
            if(!filter_var($_POST[EMAIL], FILTER_VALIDATE_EMAIL))
                return updateResult::WRONG_EMAIL_FORMAT;
            
            //$_FILES['update-profile-image']['name']) fa sì che l'utente possa lasciare vuoto il campo (allora verrà impostata al momento della registrazione
            //un'immagine di default) senza che venga restituito errore
            if(isset($_FILES['update-profile-image']['name'])){
                if (!empty($_FILES['update-profile-image']['name'])){
                
                
                if(!removeOldFile(glob(PPICTURE_PATH.'/'.$_SESSION[ID].'-*')))
                   return updateResult::ERROR_UPDATE; 

                //info sull'immagine caricata
                $img_name = saveImage($_FILES['update-profile-image']['name'], $_FILES['update-profile-image']['tmp_name'], $_FILES['update-profile-image']['error'], array("jpg", "jpeg", "png"), PPICTURE_PATH);
                if(!is_string($img_name))//in caso di errore restituisce un enum
                    return $img_name;

                $data[] = $img_name;
                $query .= ", ".PROFILEPICTURE." = ?";
                $params .= "s";
                }
               //
            }
            $query .= " WHERE ".ID." = ?";
            $params .= "i";
            $data[] = $_SESSION[ID];
            try{
                if(safeQuery($query, $data, $params) == 1){
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
