<?php
require_once("loginFunctions.php");

$resultCookieLogin = cookieLogin();
if($resultCookieLogin != loginResult::SUCCESSFUL_LOGIN){
    $resultCredentialsLogin = credentialsLogin();
    if($resultCredentialsLogin == loginResult::SUCCESSFUL_LOGIN){
        echo "Benvenutə ".$_SESSION[FIRSTNAME]." ".$_SESSION[LASTNAME];
        if(isset($_POST[REMEMBERME])){//se l'utente ha selezionato il rememberme
            if(!setRememberMe()){//se non riesco a settare il cookie
                echo "Errore nel rememberme";
            }
        }
    }
    else{
        echo "Errore nel login";              
    }
}
else{
    echo "Hai fatto veloce ".$_SESSION[FIRSTNAME]." ".$_SESSION[LASTNAME];
}
?>