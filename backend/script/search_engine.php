<?php
require_once("../funzioni/dbFunctions.php");

if(empty($_GET['search'])){
    http_response_code(400);
    exit;
};

$search = $_GET['search'];

header('Content-Type: application/json');

$query = "SELECT utente.username, utente.firstname, utente.lastname, utente.email, utente.profilePicture, utente.id
          FROM utente 
          WHERE utente.username LIKE ?
          OR utente.firstname LIKE ?
          OR utente.lastname LIKE ?
          LIMIT 5";

$params = array("%$search%", "%$search%", "%$search%");
$paramsType = "sss";

try{
    $tmp = safeQuery($query, $params, $paramsType);
    if(!is_numeric($tmp))
        echo json_encode($tmp);
    //else echo json_encode(array());    
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(array("result" => "KO", "message" => "DB_ERROR"));
    exit;
}
