<?php
    require_once "const.php";
    //TODO: vedere se si possono levare i try catch a livello di funzione e gestirli ad un livello più alto
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

    function safeQuery(String $query, array $params, String $paramsType){
        /*funzione che esegue una query al db in usando i prepared statement, se la query è una select restituisce il risultato sotto forma di array di oggetti,
        altrimenti restituisce il numero di righe interessate dalla query. Restituisce -1 se qualcosa va storto*/

        $isSelect = str_contains(strtoupper($query), "SELECT");//controllo se la query è una select

        $conn = connect();
        if($conn == null) return -1;

        $stmt = $conn -> prepare($query);
        $stmt -> bind_param($paramsType,...$params);//l'operatore "..." di unpacking serve per passare un array come parametri separati
        $stmt -> execute();
        
        if($isSelect) {
            $rows = []; $i = 0;
            $result = $stmt->get_result();
            if($result != false) //TODO: capire quando può essere false
                while($row = $result->fetch_assoc()) $rows[$i++] = $row;
            else 
                return -1;
            $result->close();
            $stmt->close();
            return $rows;
        }
        
        $nAffectedRows = $conn->affected_rows;
        $stmt->close();
        return $nAffectedRows;
    }

    enum loginResult {
        case SUCCESSFUL_LOGIN;
        case WRONG_CREDENTIALS;
        case DB_ERROR;
        case MISSING_FIELDS;
    }
    function login($data, $pass, $hash){
        //funzione che effettua il login, in $data devono essere passati i campi da inserire nella sessione
        $inSessionByDefault = array(EMAIL, FIRSTNAME, ROLE, LASTNAME);

        if(password_verify($pass, $hash)){
            if(session_status() !== PHP_SESSION_ACTIVE)
                session_start();
            
            for($i = 0; $i < count($inSessionByDefault); $i++){
                if(array_key_exists($inSessionByDefault[$i], $data)){
                    $_SESSION[$inSessionByDefault[$i]] = $data[$inSessionByDefault[$i]];
                }
            }
            return loginResult::SUCCESSFUL_LOGIN;
        }
        return loginResult::WRONG_CREDENTIALS;
    }
    function cookieLogin(){
        //Funzione che effettua il login tramite cookie
        if(empty($_COOKIE[REMEMBERME]))//controllo che il cookie sia settato
            return loginResult::MISSING_FIELDS;

        $conn = connect();
        if($conn == null)
            return loginResult::DB_ERROR;//se la connessione non va a buon fine è un problema del DB

        $actualTime = time();
        $fields = EMAIL.",".REMEMBERME.",".FIRSTNAME.",".LASTNAME;//.",".ROLE;
        $query = "SELECT $fields FROM Utente WHERE email = ? and expireTime > $actualTime";
        
        $result = safeQuery($query, array($_POST[EMAIL]), "s");
        if(!is_numeric($result)) {//controllo credenziali
            if(count($result) != 1) 
                return loginResult::WRONG_CREDENTIALS;
            return login($result[0], $_COOKIE[REMEMBERME], $result[0][REMEMBERME]);
        }
        return loginResult::DB_ERROR;
    }
    function credentialsLogin(){
        //Funzione che effettua il login tramite email e password
        if(empty($_POST[EMAIL]) || empty($_POST[PASS]))//controllo che i campi non siano vuoti
            return loginResult::MISSING_FIELDS;
       
        $conn = connect();
        if($conn == null)
            return loginResult::DB_ERROR;//se la connessione non va a buon fine è un problema del DB
        
        $fields = EMAIL.",".PASS.",".FIRSTNAME.",".LASTNAME;//.",".ROLE;
        $query = "SELECT $fields FROM Utente WHERE email = ?";
        $result = safeQuery($query, array($_POST[EMAIL]), "s");
        
        if(!is_numeric($result)) {//controllo che safeQuery abbia restituito un solo oggetto
            if(count($result) != 1)
                return loginResult::WRONG_CREDENTIALS;
            return login($result[0], $_POST[PASS], $result[0][PASS]);
        }
        return loginResult::DB_ERROR;
    }
    function setRememberMe(){
        /*funzione che setta i cookie per il rememberme, funziona solo se la sessione è già stata avviata.
          Il controllo sul campo "rememberme" deve essere fatto prima di invocare la funzione.*/

        if(!isLogged()) {//se la sessione non è stata avviata non posso settare il cookie
            return false;
        }

        $cookieValue = random_int(PHP_INT_MIN,PHP_INT_MAX);//genero un cookie value "random" che rilascio in chiaro al client
        $expireTime = time() + 60*60*24*30;//scade dopo 30 giorni
        setcookie(REMEMBERME, $cookieValue, $expireTime);//setto il cookie

        $cookieValue = password_hash($cookieValue, PASSWORD_DEFAULT);//hasho il cookie per lasciarlo sul DB
        $query = "UPDATE Utente SET rememberMe = ?, expireTime = ? WHERE email = ?";
        
        if(safeQuery($query, array($cookieValue, $expireTime, $_SESSION[EMAIL]), "sis") == 1) {
            return true;//cookie settato correttamente
        }
        error_log("dbFunctions.php/setRememberMe(): Impossibile impostare il cookie sul db \n", 3, ERROR_LOG);
        return false;//cookie non settato
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
    enum updateResult {
        case SUCCESSFUL_UPDATE;
        case MISSING_FIELDS;
        case DIFFERENT_PASSWORDS;    
        case ERROR_UPDATE;
        case ERROR_NOTLOGGED;
        case ERROR_DB;
    }
    function pswUpdate(){
        //funzione che effettua un aggiornamento della password utente dai dati mandati in POST 
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        if(empty($_POST[UPDATEREQUEST]||empty($_POST[PASS]) || empty($_POST[CONFIRM]))) return updateResult::MISSING_FIELDS;
        if($_POST[PASS] != $_POST[CONFIRM]) return updateResult::DIFFERENT_PASSWORDS;

        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;
        
        $query = "UPDATE Utente SET pass = ? WHERE email = ?";
        $HshdPsw = password_hash(trim($_POST[PASS]), PASSWORD_DEFAULT);
        if(safeQuery($query, array($HshdPsw, $_SESSION[EMAIL]), "ss") == 1)//la query deve interessare una sola riga
            return updateResult::SUCCESSFUL_UPDATE;

        return updateResult::ERROR_UPDATE;
        
    }
    function update(){
        //funzione che effettua un aggiornamento del profilo utente dai dati mandati in POST
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        if(empty($_POST[UPDATEREQUEST])) return updateResult::MISSING_FIELDS;

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
        else
            return updateResult::MISSING_FIELDS;//se non ci sono campi aggiornabili restituisco un errore

        $query = "UPDATE Utente SET $SetFields WHERE email = ?";
        $SetTypes .= "s";//per l'email come chiave 
        $SetValues[] = $_SESSION[EMAIL];//aggiungo l'email come chiave
        
        if(safeQuery($query, $SetValues, $SetTypes) == 1)
            return updateResult::SUCCESSFUL_UPDATE;
        return updateResult::ERROR_UPDATE;//nota: viene restituito questo anche qualora l'utente non avesse modificato nessun campo
    }
    function showProfile(){
        //funzione che restituisce i dati del profilo utente
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        
        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;

        $query = "SELECT firstname, lastname, email FROM Utente WHERE email = ?";
        $tmp = safeQuery($query, array($_SESSION[EMAIL]), "s");
        if(!is_numeric($tmp))
            return json_encode($tmp);
        return updateResult::ERROR_UPDATE;
    }

   /* function select(String $query, array $params, String $paramsType, bool $repeat = false){//TODO: DA CANCELLARE?
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
    }*/
?>