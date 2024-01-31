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
$tmp = safeQuery($query, $params, $paramsType);
if(!is_numeric($tmp))
    echo json_encode(safeQuery($query, $params, $paramsType));
else echo json_encode(array());    
