<?php
require_once 'dbConfig.php';
require_once 'const.php';
require_once 'dbFunctions.php';

session_start();
$_SESSION[EMAIL] = 'email17@example.com';

 $logged_in_user = array(
    'username' => 'utente123',
    'firstname' => 'Giuseppe',
    'lastname' => 'Vessicchio',
    'email' => 'maria.rossi@example.com',
    'posts' => '7',
    'followers' => '13',
    'following' => '21'
);


header('Content-Type: application/json');
echo json_encode($logged_in_user);

  


