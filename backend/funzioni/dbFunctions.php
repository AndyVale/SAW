<?php
    require_once("const.php");
    require_once("dbConfig.php");

    function connect() {
        //mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
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

    function standardQuery(String $query){
        /*funzione che esegue una query al db senza usare i prepared statement, se la query è una select restituisce il risultato sotto forma di array di oggetti,
        altrimenti restituisce il numero di righe interessate dalla query. Restituisce -1 se qualcosa va storto*/

        $isSelect = str_contains(strtoupper($query), "SELECT");//controllo se la query è una select

        $conn = connect();
        if($conn == null) return -1;

        $result = $conn->query($query);
        if($result == false) return -1;

        if($isSelect) {
            $rows = []; $i = 0;
            while($row = $result->fetch_assoc())
                $rows[$i++] = $row;
            $result->close();
            return $rows;
        }
        
        $nAffectedRows = $conn->affected_rows;
        //result->close();
        return $nAffectedRows;
    }

    function isLogged() {
        if(!empty($_SESSION[ID])) {
            return true;
        }else{
            return false;
        }
    }

    function safeSessionStart(){
        //funzione che avvia la sessione se non è già stata avviata
        if(session_status() == PHP_SESSION_NONE) session_start();
        if(isLogged()) return true;
        return false;
    }
    //funzione che restituisce true se ci sono campi vuoti inviati in $_POST
    function emptyFields() {
        //funzione che restituisce un array contenente tutti gli argomenti passati a una funzione
        //comunemente utilizzata quando si vuole creare una funzione che accetta un numero variabile di argomenti
            $args = func_get_args();
    
            foreach ($args as $fieldName) {
                if (empty($_POST[$fieldName])) {
                    return true; // Trovato un campo vuoto
                }
            }
            return false; // Nessun campo vuoto
        }

    function add_tuple(String $table, Array $attributesNames, Array $attributesValues, String $attributesTypes){
        $query = "INSERT INTO $table";
        $query .= " (";
        for ($i = 0; $i < count($attributesNames) - 1; $i++){//costruisco la query
            $query .= $attributesNames[$i] . ", ";
        }
        $query .= $attributesNames[count($attributesNames) - 1] . ") VALUES (";
        for ($i = 0; $i < count($attributesNames) - 1; $i++){//costruisco la query
            $query .= "?, ";
        }
        $query .= "?)";
        try{
            if(safeQuery($query, $attributesValues, $attributesTypes) == 1)
                return array("result" => "INSERT", "message" => "OK");
        }catch(Exception $e){
            error_log("dbFunctions.php/add_tuple(): ".$e->getMessage()."\n", 3, ERROR_LOG);
        }
        return array("result" => "KO", "message" => "ERROR");
    }

    function delete_tuple(String $table, Array $attributesNames, Array $attributesValues, String $attributesTypes){
        $query = "DELETE FROM $table WHERE ";
        for ($i = 0; $i < count($attributesNames) - 1; $i++){//costruisco la query
            $query .= $attributesNames[$i] . " = ? AND ";
        }
        $query .= $attributesNames[count($attributesNames) - 1] . " = ?";
        try{
            if(safeQuery($query, $attributesValues, $attributesTypes) >= 1);
                return array("result" => "DELETE", "message" => "OK");
        }catch(Exception $e){
            error_log("dbFunctions.php/delete_tuple(): ".$e->getMessage()."\n", 3, ERROR_LOG);
        }
        return array("result" => "KO", "message" => "ERROR");
    }