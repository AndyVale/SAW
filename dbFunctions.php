<?php
    require_once "const.php";
    function connect() {
        /*La funzione restituisce l'oggetto mysqli connesso al db specificato se la connessione va a buon fine, null altrimenti*/
        static $conn;//variabile statica, la prima volta che viene chiamata la funzione la variabile viene inizializzata, le volte successive viene restituito il valore della variabile
        //uso un try catch per gestire eventuali problematiche nella connessione al database
        try {
            if($conn == null)
                $conn = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);//costanti definite in dbConfig.php
            return $conn;
        }
        catch(Exception $e) {
            error_log("dbFunctions.php/Connect(): ".$e->getMessage()."\n", 3, ERROR_LOG);
            //throw $e;
            return null;
        }
    }

    enum loginResult {
        case SUCCESSFUL_LOGIN;
        case WRONG_CREDENTIALS;
        case WRONG_COOKIE;
        case DB_ERROR;
        case MISSING_FIELDS;
    }
    function login($data){
        //funzione che effettua il login, deve essere chiamata SOLO a seguito di esito positivo del controllo delle credenziali
        if(session_status() !== PHP_SESSION_ACTIVE) session_start();
        $_SESSION[EMAIL] = $data[EMAIL];
        $_SESSION[FIRSTNAME] = $data[FIRSTNAME];
        $_SESSION[LASTNAME] = $data[LASTNAME];
        $_SESSION[ROLE] = $data[ROLE];
    }
    function cookieLogin(){
        //Funzione che effettua il login tramite cookie
        if(empty($_COOKIE[REMEMBERME]))//controllo che il cookie sia settato
            return loginResult::MISSING_FIELDS;
        
        try {//controllo che il cookie sia valido
            $conn = connect();
            if($conn == null)
                return loginResult::DB_ERROR;//se la connessione non va a buon fine è un problema del DB

            $actualTime = time();
            $fields = EMAIL.",".REMEMBERME.",".FIRSTNAME.",".LASTNAME.",".ROLE;
            $query = "SELECT $fields FROM utenti WHERE email = ? and expireTime > $actualTime";
            $stmt = $conn -> prepare($query);//TODO: è necessario usare un preperrd statement?L'email era già stata controllata in fase di registrazione e inserita in sessione in fase di login
            $stmt -> bind_param('s', $_POST[EMAIL]);
            $stmt -> execute();
            $result = $stmt->get_result();
            $nAffectedRows = $conn->affected_rows;
            $stmt->close();

            if($nAffectedRows == 1) {//controllo credenziali
                $data = $result->fetch_assoc();
                if(password_verify($_COOKIE[REMEMBERME], $data[REMEMBERME]))//cookie corretto
                {
                    login($data);
                    return loginResult::SUCCESSFUL_LOGIN;
                }
            }
            return loginResult::WRONG_COOKIE;//cookie errato
        }catch(Exception $e) {
            error_log("dbFunctions.php/cookieLogin(): ".$e->getMessage()."\n", 3, ERROR_LOG);
            return loginResult::DB_ERROR;
        }
    }
    function credentialsLogin(){
        //Funzione che effettua il login tramite email e password
        if(empty($_POST[EMAIL]) || empty($_POST[PASS]))//controllo che i campi non siano vuoti
            return loginResult::MISSING_FIELDS;

        try {
            $conn = connect();
            if($conn == null)
                return loginResult::DB_ERROR;//se la connessione non va a buon fine è un problema del DB
            
            //uso un prepared statement per evitare sql injection
            $stmt = $conn -> prepare("SELECT * FROM utenti WHERE email = ?");
            $stmt -> bind_param("s", $_POST[EMAIL]);
            $stmt->execute();

            $result = $stmt->get_result();            
            if($conn->affected_rows == 1) {//controllo credenziali
                $stmt->close();
                $data = $result->fetch_assoc();
                if(password_verify($_POST[PASS], $data[PASS]))//credenziali corrette
                {
                    login($data);
                    if(isset($_POST[REMEMBERME])) {//se c'è il rememberme setto il cookie 
                        setRememberMe();//TODO: lo lasciamo qui o teniamo le funzioni separate?
                    }
                    return loginResult::SUCCESSFUL_LOGIN;
                }
            }
            $stmt->close();
            return loginResult::WRONG_CREDENTIALS;//credenziali errate

        }catch(Exception $e) {
            error_log("dbFunctions.php/login(): ".$e->getMessage()."\n", 3, ERROR_LOG);
            return loginResult::DB_ERROR;
        }
    }
    function setRememberMe(){
        /*funzione che setta i cookie per il rememberme, funziona solo se la sessione è già stata avviata.
          Il controllo sul campo "rememberme" deve essere fatto prima di invocare la funzione.*/
        if(empty($_SESSION[EMAIL])) {//se la sessione non è stata avviata non posso settare il cookie
            return false;
        }
        $cookieValue = random_int(PHP_INT_MIN,PHP_INT_MAX);//genero un cookie value "random" che rilascio in chiaro al client
        $expireTime = time() + 60*60*24*30;//scade dopo 30 giorni
        try{
            setcookie(REMEMBERME, $cookieValue, $expireTime);//setto il cookie
            $cookieValue = password_hash($cookieValue, PASSWORD_DEFAULT);//hasho il cookie per lasciarlo sul DB
            $conn = connect();
            $query = "UPDATE utenti SET rememberMe = ?, expireTime = ? WHERE email = ?";
            $stmt = $conn -> prepare($query);
            $stmt -> bind_param('sis', $cookieValue, $expireTime, $_POST[EMAIL]);
            $stmt -> execute();
            if($conn->affected_rows != 1) {
                error_log("dbFunctions.php/setRememberMe(): Impossibile impostare il cookie sul db \n", 3, ERROR_LOG);
                $stmt -> close();
                return false;//errore nella query
            }
            $stmt -> close();
            return true;//cookie settato correttamente
        }catch(Exception $e) {
            error_log("dbFunctions.php/setRememberMe(): ".$e->getMessage()."\n", 3, ERROR_LOG);
            return false;//errore di altro tipo dovuto al db o al setting del cookie
        }
    }
    function isLogged() {
        if(!empty($_SESSION[EMAIL])) {
            return true;
        }else{
            return false;
        }
    }
    function logout() {
        //funzione che distrugge la sessione e i cookie
        if(session_status() == PHP_SESSION_ACTIVE) session_destroy();
        setcookie(REMEMBERME, "", time()-3600);
        return true;
    }
    
    enum registerResult {
        case SUCCESSFUL_REGISTER;
        case EMAIL_ALREADY_EXISTS;
        case DB_ERROR;
        case MISSING_FIELDS;
        case WRONG_EMAIL_FORMAT;
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

        try{
            $conn = connect();
            //cripto la password;
            //sanitizzo i dati per evitare attacchi XSS;
            //faccio il trim per evitare problemi con gli spazi;
            //passo a lowercase l'email per evitare problemi con la case sensitivity:
            //TODO:Forse l'email posso evitare di passarla a htmlentities, tanto è già stata validata
            $data = array(  FIRSTNAME => htmlentities(trim($_POST[FIRSTNAME])), 
                            LASTNAME => htmlentities(trim($_POST[LASTNAME])),
                            EMAIL => htmlentities(strtolower($_POST[EMAIL])),
                            PASS => password_hash(trim($_POST[PASS]), PASSWORD_DEFAULT)
                        );

            //uso un prepared statement per evitare sql injection
            $stmt = $conn -> prepare("INSERT INTO utenti (firstname, lastname, email, pass) VALUES (?, ?, ?, ?)");

            $stmt -> bind_param('ssss', $data[FIRSTNAME], $data[LASTNAME], $data[EMAIL], $data[PASS]);
            try{
                $stmt->execute();
            }
            catch(Exception $ex){
                return registerResult::EMAIL_ALREADY_EXISTS;
            }
            return $stmt->affected_rows;
        }catch(Exception $e) {
            error_log("dbFunctions.php/register(): ".var_dump($e)."\n", 3, ERROR_LOG);
            return registerResult::DB_ERROR;
        }
    }

    function select(String $query, array $params, String $paramsType, bool $repeat = false){//TODO: DA CANCELLARE?
        //funzione che effettua una select dal db e restituisce il risultato sotto forma di array di oggetti
        $conn = connect();
        $stmt = $conn -> prepare($query);
        $stmt -> bind_param($paramsType,...$params);
        $stmt -> execute();

        $rows = []; $i = 0;
        $result = $stmt->get_result();
        while($row = $result->fetch_object())$rows[$i++] = $row;
        $result->close();
        if(!$repeat)
            $stmt->close();
        return $rows;
    }
    enum updateResult {
        case SUCCESSFUL_UPDATE;
        case ERROR_UPDATE;
        case ERROR_NOTLOGGED;
        case ERROR_DB;
    }

    function showProfile(){
        //funzione che restituisce i dati del profilo utente
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;
        $query = "SELECT firstname, lastname, email FROM utenti WHERE email = ?";
        try{
            $stmt = $conn -> prepare($query);
            $stmt -> bind_param('s', $_SESSION[EMAIL]);
            $stmt -> execute();
            $result = $stmt->get_result();
            $stmt -> close();
            return $result->fetch_assoc();
        }catch(Exception $e) {
            error_log("dbFunctions.php/showProfile(): ".$e->getMessage()."\n", 3, ERROR_LOG);
            return updateResult::ERROR_DB;
        }
    }
    function update(){
        //funzione che effettua un aggiornamento del profilo utente dai dati mandati in POST
        if(!isLogged() && $_POST[UPDATEREQUEST]) return updateResult::ERROR_NOTLOGGED;
        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;
        
        $SetFields = "";
        $SetValues = array();
        $SetTypes = "";
        $updatableFields = array(FIRSTNAME, LASTNAME, EMAIL);

        foreach($_POST as $key => $value) {//la key sarebbe il nome del campo, il value il valore contenuto in POST
            if(in_array($key, $updatableFields)) {//se ci sono campi in POST che rientrano tra quelli aggiornabili
                $SetFields .= $key." = ?, ";//aggiungo la stringa al campo SET della query
                $SetValues[] = $value;//aggiungo il valore all'array dei valori (su cui farò il bind)
                $SetTypes .= "s";//aggiungo il tipo che è sempre string per i campi aggiornabili
            }
        }
        
        //TODO: aggiungere altri campi FACOLTATIVI

        $strLen = strlen($SetFields);
        if($strLen > 0)
            $SetFields = substr($SetFields, 0, $strLen-2);//tolgo l'ultima virgola e lo spazio

        //var_dump($SetFields);
        //var_dump($SetValues);

        $query = "UPDATE utenti SET $SetFields WHERE email = ?";
        $SetTypes .= "s";//per l'email come chiave 
        $email = array($_SESSION[EMAIL]);
        try{
            $stmt = $conn -> prepare($query);
                /*   l'operatore "..." di unpacking serve per passare un array come parametri separati.
                    PHP non permette di passare parametri "singoli" dopo aver eseguito l'operatore di unpacking,
                    per questo anche l'email è stata inserita in un array:
            */
            $stmt -> bind_param($SetTypes, ...$SetValues, ...$email);
            $stmt -> execute();
            $affectedRows = $conn->affected_rows;
            $stmt -> close();
            if($affectedRows == 1)
                return updateResult::SUCCESSFUL_UPDATE;
            return updateResult::ERROR_UPDATE;
        }catch(Exception $e) {
            error_log("dbFunctions.php/update(): ".$e->getMessage()."\n", 3, ERROR_LOG);
            return updateResult::ERROR_DB;
        }
    }
?>