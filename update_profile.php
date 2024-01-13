<?php
 
 session_start();
 require_once "dbConfig.php";
 require_once "dbFunctions.php";
 require_once "const.php";

 //forzo la creazione di una sessione a solo scopo didattico
 $_SESSION[EMAIL] = 'email17@example.com';


 // Simula i dati dell'utente. In un'applicazione reale, dovrai recuperare questi dati dal tuo sistema di autenticazione.
 $logged_in_user = [
    'username' => 'utente123',
    'firstname' => 'Maria',
    'lastname' => 'Rossi',
    'email' => 'maria.rossi@example.com'
    /*,
    'posts' => '7',
    'followers' => '13',
    'following' => '21',
    */
];

// Verifica che l'utente sia autenticato (simulato)
if (isLogged()) {
    // Se l'utente è autenticato, restituisci i dati dell'utente
    header('Content-Type: application/json');
    echo json_encode($logged_in_user);
    //Verificare il perchè questa istruzione dia problemi
    //echo showProfile();
} else {
    // Se l'utente non è autenticato, restituisci un errore
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Utente non autenticato']);
}

/*

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
 */

 ?>