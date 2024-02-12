<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

require_once 'Compte.php';

$timezoneId = 'Europe/Paris';
date_default_timezone_set($timezoneId);

class Operation
{
    private static int $idC;
    private int $id;
    private float $montant;
    private bool $type;
    private string $date;
    private bool $statut;

    public function __construct($montant, bool $type, bool $statut)
    {

        self::$idC = (isset($_SESSION['idO'])) ? $_SESSION['idO'] : 0;
        self::$idC++;
        $this->id = self::$idC;
        $this->montant = $montant;
        $this->type = $type;
        $this->statut = $statut;
        $this->date = date('d-m-Y H:i:s');
        $_SESSION['idO'] = self::$idC;
    }

    public function get_operation(): object
    {
        return (object) [
            "id" => $this->id,
            "montant" => $this->montant,
            "date" => $this->date,
            "type" => $this->type,
            "Accepted" => $this->statut
        ];
    }

    public static function getAllOperation(array $comptes): array
    {
        $allOperations = [];

        foreach ($comptes as $compte) {
            $compte = unserialize($compte);
            $operations = $compte->getHistory();
            $allOperations = array_merge($allOperations, $operations);
        }

        return $allOperations;
    }
}
