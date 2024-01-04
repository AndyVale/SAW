<?php
    require_once("./Aus/dbConfig.php");
    require_once("./Aus/dbFunctions.php");
    require_once("./Aus/const.php");

    enum registerResult {
        case SUCCESSFUL_REGISTER;
        case EMAIL_ALREADY_EXISTS;
        case DB_ERROR;
        case MISSING_FIELDS;
        case WRONG_EMAIL_FORMAT;
        case ERROR_REGISTER;
        case DIFFERENT_PASSWORDS;//TODO:Ha senso questa?Se l'utente passa da curl saranno fatti suoi se non vuole confermare la password
    }
    function register(){
        //funzione che registra un utente
        if(empty($_POST[EMAIL]) || empty($_POST[PASS]) || empty($_POST[FIRSTNAME]) || empty($_POST[LASTNAME]) || empty($_POST[CONFIRM]))//controllo che i campi non siano vuoti
            return registerResult::MISSING_FIELDS;

        if(!filter_var($_POST[EMAIL], FILTER_VALIDATE_EMAIL))//controllo che l'email sia valida
            return registerResult::WRONG_EMAIL_FORMAT;

        if($_POST[PASS] != $_POST[CONFIRM])//controllo che le password coincidano
            return registerResult::DIFFERENT_PASSWORDS;

        //cripto la password;
        //sanitizzo i dati per evitare attacchi XSS;
        //faccio il trim per evitare problemi con gli spazi;
        //passo a lowercase l'email per evitare problemi con la case sensitivity:
        //TODO:Forse l'email posso evitare di passarla a htmlentities, tanto è già stata validata
        $data = array(  htmlentities(trim($_POST[FIRSTNAME])), 
                        htmlentities(trim($_POST[LASTNAME])),
                        htmlentities(strtolower($_POST[EMAIL])),
                        password_hash(trim($_POST[PASS]), PASSWORD_DEFAULT)
                    );

        //uso un prepared statement per evitare sql injection
        $query = "INSERT INTO Utente (firstname, lastname, email, pass) VALUES (?, ?, ?, ?)";

        try{
            if(safeQuery($query, $data, "ssss") == 1)
                return registerResult::SUCCESSFUL_REGISTER;
            return registerResult::DB_ERROR;
        }
        catch(mysqli_sql_exception $ex){
            error_log("dbFunctions.php/register(): ".$ex->getMessage()."\n", 3, ERROR_LOG);
            return registerResult::EMAIL_ALREADY_EXISTS;
        }
        
    }
?>