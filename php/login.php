<?php
require_once("loginFunctions.php");

$resultCookieLogin = cookieLogin();
if($resultCookieLogin != loginResult::SUCCESSFUL_LOGIN){
    $resultCredentialsLogin = credentialsLogin();
    if($resultCredentialsLogin == loginResult::SUCCESSFUL_LOGIN){
        $result = 'OK';
        if(isset($_POST[REMEMBERME])){//se l'utente ha selezionato il rememberme
            if(!setRememberMe()){//se non riesco a settare il cookie
                $result = 'OKnr';
            }
        }
    }
    else{
        $result = 'KO';            
    }
}
else{
    $result = 'OK';
}
echo $result;
//header("Location: ./grafica/form.php?esito=$result");//TODO: cambiare pagina di reindirizzamento e aggiungere dati per comunicare al frontend l'esito
?>