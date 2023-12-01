<?php
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
            error_log("dbFunctions.php/Connect(): ".$e->getMessage()."\n", 3, "../Errors.log");
            //throw $e;
            return null;
        }
    }

    enum loginResult {
        case SUCCESSFUL_LOGIN;
        case WRONG_CREDENTIALS;
        case DB_ERROR;
        case MISSING_FIELDS;
    }
    function login(){
        //funzione che effettua login tramite cookie o tramite email e password
        /*La funzione restituisce:
                loginResult::SUCCESSFUL_LOGIN se la connessione al db non riesce
                loginResult::WRONG_CREDENTIALS se le credenziali sono corrette
                loginResult::DB_ERROR se le credenziali sono errate 
                loginResult::MISSING_FIELDS se i campi email e/o password sono vuoti    
        */
        //TODO:if(cookieLogin() non va a buon fine)
        return credentialsLogin();
    }

    //function cookieLogin(){
        //Funzione che effettua il login tramite cookie
    //}
    function credentialsLogin(){
        //Funzione che effettua il login tramite email e password
        if(empty($_POST['email']) || empty($_POST['pass']))//controllo che i campi non siano vuoti
            return loginResult::MISSING_FIELDS;

        try {
            $conn = connect();
            if($conn == null)
                return false;
            //uso un prepared statement per evitare sql injection
            $stmt = $conn -> prepare("SELECT * FROM utenti WHERE email = ?");
            $stmt -> bind_param("s", $_POST['email']);
            $stmt->execute();

            $result = $stmt->get_result();
            $stmt->close();
            if($conn->affected_rows == 1) {//controllo credenziali
                $data = $result->fetch_assoc();
                if(password_verify($_POST["pass"], $data["pass"]))//credenziali corrette
                {
                    session_start();
                    $_SESSION["email"] = $data["email"];
                    $_SESSION["firstname"] = $data["firstname"];
                    $_SESSION["lastname"] = $data["lastname"];
                    $_SESSION["role"] = $data["role"];
                    //TODO: Aggiungere i cookie per il rememberme
                    return loginResult::SUCCESSFUL_LOGIN;
                }
            }
            return loginResult::WRONG_CREDENTIALS;//credenziali errate

        }catch(Exception $e) {
            error_log("dbFunctions.php/login(): ".$e->getMessage()."\n", 3, "../Errors.log");
            return loginResult::DB_ERROR;
        }
    }
    function isLogged() {
        if(!empty($_SESSION['email'])) {
            return true;
        }else{
            return false;
        }
    }
    function logout() {
        //funzione che distrugge la sessione e i cookie
        session_unset();
        session_destroy();
        //TODO: distruggere i cookie
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
        if(empty($_POST['email']) || empty($_POST['pass']) || empty($_POST['firstname']) || empty($_POST['lastname']) || empty($_POST["confirm"]))//controllo che i campi non siano vuoti
            return registerResult::MISSING_FIELDS;
        if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL))//controllo che l'email sia valida
            return registerResult::WRONG_EMAIL_FORMAT;
        if($_POST['pass'] != $_POST['confirm'])//controllo che le password coincidano
            return registerResult::DIFFERENT_PASSWORDS;

        try{
            $conn = connect();
            //cripto la password;
            //sanitizzo i dati per evitare attacchi XSS;
            //faccio il trim per evitare problemi con gli spazi;
            //passo a lowercase l'email per evitare problemi con la case sensitivity:
                //TODO:Forse l'email posso evitare di passarla a htmlentities, tanto è già stata validata
            $data = array(  'firstname' => htmlentities(trim($_POST['firstname'])), 
                            'lastname' => htmlentities(trim($_POST['lastname'])),
                            'email' => htmlentities(strtolower($_POST['email'])),
                            'pass' => password_hash(trim($_POST['pass']), PASSWORD_DEFAULT)
                        );

            //uso un prepared statement per evitare sql injection
            $stmt = $conn -> prepare("INSERT INTO utenti (firstname, lastname, email, pass) VALUES (?, ?, ?, ?)");

            $stmt -> bind_param('ssss', $data['firstname'], $data['lastname'], $data['email'], $data['pass']);
            try{
                $stmt->execute();
            }
            catch(Exception $ex){
                return registerResult::EMAIL_ALREADY_EXISTS;
            }
            return $stmt->affected_rows;
        }catch(Exception $e) {
            error_log("dbFunctions.php/register(): ".var_dump($e)."\n", 3, "../Errors.log");
            return registerResult::DB_ERROR;
        }
    }

    function select(String $query, array $params, String $paramsType, bool $repeat = false){
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

    function setRememberMe(){
        //funzione che setta i cookie per il rememberme
        
    }
    function insert($table, $fields, $where, $order, $limit, $offset, $repeat){
        //funzione che effettua una insert nel db, se repeat è true viene restituito lo statement della prepared stmt in modo da poterla riutilizzare, altrimetti viene distrutta.
    }

    function update(){
        //funzione che effettua un update nel db, se repeat è true viene restituito lo statement della prepared stmt in modo da poterla riutilizzare, altrimetti viene distrutta.
        
    }
?>