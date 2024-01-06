<?php
    require_once("registrationFunctions.php");
    
    switch(register()){
        case registerResult::SUCCESSFUL_REGISTER:
            //aggiungo campi per la registrazione avvenuta con successo
            $result['result'] = 'OK';
            $result['message'] = 'Registrazione avvenuta con successo';
            break;
        case registerResult::EMAIL_ALREADY_EXISTS:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'EMAIL_ALREADY_EXISTS';
            break;
        case registerResult::DB_ERROR:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'DB_ERROR';
            break;    
        case registerResult::MISSING_FIELDS:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'MISSING_FIELDS';
            break;
        case registerResult::WRONG_EMAIL_FORMAT:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'WRONG_EMAIL_FORMAT';
            break;
        case registerResult::DIFFERENT_PASSWORDS:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'DIFFERENT_PASSWORDS';
            break;
    }
    
    echo json_encode($result);//TODO: cambiare pagina di reindirizzamento e aggiungere dati per comunicare al frontend l'esito
?>