<?php
    function connect() {
        static $conn;
        try {
            if($conn == null)
                $conn = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
            return $conn;
        }
        catch(Exception $e) {
            return null;
        }
    }
?>