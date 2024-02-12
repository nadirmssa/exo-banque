<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

require_once('Class/Compte.php');
require_once('Class/Operation.php');

$method = $_SERVER['REQUEST_METHOD'];

if (!isset($_SESSION['comptes'])) {
    $_SESSION['comptes'] = [];
}
$req = trim(file_get_contents("php://input"));
$data = json_decode($req, true);


if ($method === 'POST') {
    // infoCompte
    if (!empty($_GET['compte']) && $_GET['compte'] == 'show') {
        echo json_encode(send_info_compte($data['id'], $_SESSION['comptes']));
    } else {
        $newCompte = null;
        // create compte
        if ($data['type'] === 'courant') {
            $newCompte = new CompteCourant($data['montant'], $data['tx']);
        } elseif ($data['type'] === 'epargne') {
            $newCompte = new CompteEpargne($data['montant']);
        }
        $Comptes = $_SESSION['comptes'];
        $newCompteSerial = serialize($newCompte);
        $Comptes[] = $newCompteSerial;
        $_SESSION['comptes'] = $Comptes;
        echo json_encode($newCompte->getInfoCompte());
    }
} elseif ($method === 'GET') {
    // List comptes
    if (isset($_GET['need']) && $_GET['need'] === 'comptes') {
        echo json_encode(arrUnserial($_SESSION['comptes']));
    }
    // list operations 
    if (isset($_GET['need']) && $_GET['need'] === 'operations') {
        $allOperations = Operation::getAllOperation($_SESSION['comptes']);
        echo json_encode(send_sort_operations($allOperations));
    }

    if (isset($_GET['need']) && $_GET['need'] === 'destroy') {
        session_destroy();
        echo json_encode('session destroyed');
    }
} elseif ($method === 'PATCH') {
    // add operation
    if (isset($_GET['op'])) {
        $comptesWithNewOperation = add_operation($data, $_SESSION['comptes']);
        $_SESSION['comptes'] = $comptesWithNewOperation;
        echo json_encode(arrUnserial($comptesWithNewOperation));
    }
}

function arrUnserial(array $comptes)
{
    $unserialArr = [];
    foreach ($comptes as $compte) {
        $cptInfo = unserialize($compte);
        $unserialArr[] = $cptInfo->getInfoCompte();
    }
    return $unserialArr;
}

function add_operation($bodyReq, $comptes)
{
    $newComptes = [];
    foreach ($comptes as $compte) {
        $compte = unserialize($compte);
        if ($bodyReq['id'] == $compte->getId()) {
            if ($bodyReq['type'] === true) {
                $compte->credit($bodyReq['montant']);
            } else {
                $compte->debit($bodyReq['montant']);
            }
        }
        $compte = serialize($compte);
        $newComptes[] = $compte;
    }
    return $newComptes;
}

function send_sort_operations(array $operations)
{
    usort($operations, function ($a, $b) {
        $a = parse_date($a->date);
        $b = parse_date($b->date);
        return strtotime($b) - strtotime($a);
    });
    return $operations;
}

function parse_date(string $date): string | null
{
    $date = trim($date);
    $ymd = explode(" ", $date, 2);
    $arrYMD = explode("-", $ymd[0], 3);
    $day = $arrYMD[0];
    $month = $arrYMD[1];
    $year = $arrYMD[2];
    $newdate = implode("-", [$year, $month, $day]);
    return $newdate . " " . $ymd[1];
}

function send_info_compte($id, array $comptes)
{
    foreach ($comptes as $compte) {
        $compte = unserialize($compte);
        if ($id == $compte->getId()) {
            return $compte->getInfoCompte();
        }
    }
    return false;
}
