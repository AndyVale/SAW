<?php
    require_once("../funzioni/loginFunctions.php");
    
    header('Content-Type: application/json');
    $result['from'] = 'login.php';

    switch(CredentialsLogin()){
        case loginResult::SUCCESSFUL_LOGIN:
            $result['result'] = 'OK';
            $result['message'] = 'Login tramite credenziali avvenuto con successo';

            $result['data'] = array(FIRSTNAME=>$_SESSION[FIRSTNAME], LASTNAME=>$_SESSION[LASTNAME], EMAIL=>$_SESSION[EMAIL], USERNAME => $_SESSION[USERNAME]);

            if(isset($_POST[REMEMBERME])){//se l'utente ha selezionato il rememberme
                if(!setRememberMe()){//se non riesco a settare il cookie
                    $result['rememberme'] = 'KO';
                }
                else{
                    $result['rememberme'] = 'OK';
                }
            }

            break;
        case loginResult::WRONG_CREDENTIALS:
            $result['result'] = 'KO';
            $result['message'] = 'WRONG_CREDENTIALS';
            break;
        case loginResult::DB_ERROR:
            $result['result'] = 'KO';
            $result['message'] = 'DB_ERROR';
            break;
        case loginResult::MISSING_FIELDS:
            $result['result'] = 'KO';
            $result['message'] = 'MISSING_FIELDS';
            break;
        default:
            $result['result'] = 'KO';
            break;
    }

    echo json_encode($result);
