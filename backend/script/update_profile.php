<?php
 
 //ho iniziato solo a guardarle ma non c'è ancora niente di concreto qui
 session_start();
 include "../funzioni/dbConfig.php";
 include "../funzioni/dbFunctions.php";

 $result = showProfile();

if ($result === updateResult::ERROR_NOTLOGGED) {
    // Utente non autenticato
} elseif ($result === updateResult::ERROR_DB) {
    // Errore di connessione al database
} elseif ($result === updateResult::ERROR_UPDATE) {
    // Altri errori durante l'esecuzione della query
} else {
    // La funzione ha restituito un JSON con i dati del profilo
    // json_decode conve il JSON in un array associativo
    $profileData = json_decode($result, true);

    // $profileData contiene i dati del profilo
    echo "First Name: " . $profileData['firstname'] . "<br>";
    echo "Last Name: " . $profileData['lastname'] . "<br>";
    echo "Email: " . $profileData['email'] . "<br>";
}

 if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $result = update();
    if ($result == updateResult::SUCCESSFUL_UPDATE) {
        $message = "Profilo aggiornato con successo!";
        
    } else {
        $message = "Si è verificato un errore durante l'aggiornamento del profilo.";
    }
    echo $message;
  }

 ?>