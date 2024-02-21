<?php 
 require_once("../funzioni/dbFunctions.php");

 header('Content-Type: application/json');

function RandomPosts(){
try{
    $result['from'] = 'homepage.php';
    $query = "SELECT urlImmagine, idUtente, altDescription, username FROM post JOIN utente ON post.idUtente=utente.ID ORDER BY RAND() LIMIT 6"; 
    $res = standardQuery($query);
    if($res == -1) {
        $result['result'] = 'KO'; $result['message'] = 'DB_ERROR';
         }
    if(!is_numeric($res) && count($res) == 6){
        $result['result'] = 'OK';
        $result['message'] = 'Post randomici prelevati con successo';
        $result['data'] = $res;
        }
    else {
        $result['result'] = 'KO';
        $result['message'] = 'Uffa';
    }
}catch(mysqli_sql_exception $ex){
    //error_log("homepage.php: ".$ex->getMessage()."\n", 3, ERROR_LOG);
    $result['result'] = 'KO'; $result['message'] = 'DB_ERROR';
}
    return $result;
}

echo json_encode(RandomPosts());