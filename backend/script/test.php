<?php
    require_once "../funzioni/dbConfig.php";
    require_once "../funzioni/dbFunctions.php";
    require_once "../funzioni/const.php";
    require_once "../funzioni/loginFunctions.php";
    /*$conn = connect();
    if($conn == null) {
        echo "connessione fallita<br>";
    }else{
        echo "connessione riuscita<br>";
    }
    */
    $_POST['email'] = "cicciobello@mail.com";
    $_POST['pass'] = "pass1";
    //echo "<br><br><br>";
    credentialsLogin();
    //echo "<br><br><br>";
    
    $_POST['email'] = "cicciobello@mail.com";  
    echo ('<html>
    <body>
      <form method="POST" action="./update_profile.php">
      <input type="text" name="email" value="ciccixodadbello@mail.com">
      <input type="submit" value="Invia">
      </form>
    </body>
  </html>');
    //var_dump(cookieLogin());
    //var_dump($_SESSION);
?>