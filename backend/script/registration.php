<?php
    require_once("../funzioni/registrationFunctions.php");
    
    header('Content-Type: application/json');
    $result['from'] = 'registration.php';
    
    switch(register()){
        case registerResult::SUCCESSFUL_REGISTER:
            //aggiungo campi per la registrazione avvenuta con successo
            $result['result'] = 'OK';
            $result['message'] = 'Registrazione avvenuta con successo';
            //http_response_code(200);
            break;
        case registerResult::EMAIL_ALREADY_EXISTS:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'EMAIL_ALREADY_EXISTS';
            //http_response_code(400);
            break;
        case registerResult::DB_ERROR:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'DB_ERROR';
            //http_response_code(500);
            break;    
        case registerResult::MISSING_FIELDS:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'MISSING_FIELDS';
            //http_response_code(400);
            break;
        case registerResult::WRONG_EMAIL_FORMAT:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'WRONG_EMAIL_FORMAT';
            //http_response_code(400);
            break;
        case registerResult::DIFFERENT_PASSWORDS:
            //aggiungo campi per l'esito negativo della registrazione
            $result['result'] = 'KO';
            $result['message'] = 'DIFFERENT_PASSWORDS';
            //http_response_code(400);
            break;
    }
    
    echo json_encode($result);
