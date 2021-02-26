<?php
    $db = new mysqli('localhost', 'root', '', 'nodeapp');

    if($db->connect_errno){
        die('Database Connection Error. Please try again later!.');
    }
?>