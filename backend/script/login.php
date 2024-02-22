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
            http_response_code(200);
            break;
        case loginResult::WRONG_CREDENTIALS:
            $result['result'] = 'KO';
            $result['message'] = 'WRONG_CREDENTIALS';
            http_response_code(401);
            break;
        case loginResult::DB_ERROR:
            $result['result'] = 'KO';
            $result['message'] = 'DB_ERROR';
            http_response_code(500);
            break;
        case loginResult::MISSING_FIELDS:
            $result['result'] = 'KO';
            $result['message'] = 'MISSING_FIELDS';
            http_response_code(400);
            break;
        default:
            $result['result'] = 'KO';
            http_response_code(500);
            break;
    }

    echo json_encode($result);
