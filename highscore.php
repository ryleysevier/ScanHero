<?php
/**
 * Created by PhpStorm.
 * User: ryleysevier
 * Date: 6/6/14
 * Time: 4:43 PM
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept"');

//GET OPERATIONS
if (isset($_GET['operation'])){
    $operation = $_GET['operation'];
    switch($operation){
        case 'getScores':
            connectToDatabase();
            $value = getScores();
            while($row = mysql_fetch_assoc($value)){$rows[] = $row;}
            echo json_encode($rows);
            break;
    }
}

/////////////////////////////////////////

//POST OPERATIONS
//IF STORING A CONFIGURATION FILE////////
$value = file_get_contents('php://input');
if ($value) {

    $valueJ = json_decode($value);

    $operation = $valueJ->{'operation'};

    switch($operation){
        case 'addScore':
            connectToDatabase();
            addScore($valueJ->{'name'}, $valueJ->{'score'});
            break;
    }

}

/////////////////////////////////////////////

function connectToDatabase() {
    $mysqlhost = "";
    $mysqlusername = "";
    $mysqlpassword = "";

    $con = mysql_connect($mysqlhost, $mysqlusername, $mysqlpassword);

    if (!$con) {
        die('Could not connect: ' . mysql_error());
    }
    else {
    }

    mysql_select_db('scan_hero_db') or die('Could not select database: ' . mysql_error());

    return $con;
}

// Returns the details of a single order for a specific Order ID
function getScores(){
    $sql = "SELECT * FROM `highscores` ORDER BY score DESC LIMIT 10;";
    return mysql_query($sql);
}

// Saves an order to a new entry
function addScore($name, $score){

    $sql = "INSERT INTO `highscores`(`name`, `score`) VALUES ('". $name."','". $score."');";

    mysql_query($sql);
    echo $sql;
    echo "Score added: ";
    $id_order = mysql_insert_id();

    echo $id_order;
}
