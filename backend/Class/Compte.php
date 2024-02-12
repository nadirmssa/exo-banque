<?php

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
require_once("Operation.php");


class Compte
{
    private static int $idC;
    protected int $id;
    protected float $solde = 0;
    protected array $arrOperation = [];

    public function __construct($montant)
    {
        self::$idC = (isset($_SESSION['idC'])) ? $_SESSION['idC'] : 0;
        self::$idC++;
        $this->id = self::$idC;
        $this->credit($montant);
        $_SESSION['idC'] = self::$idC;
    }

    protected function addOperation(object $operation): void
    {
        array_push($this->arrOperation, $operation);
    }

    public function credit($montant): void
    {
        $operation = new Operation($montant, true, true);
        $this->solde = $this->solde + $montant;
        $this->addOperation($operation->get_operation());
    }

    public function debit($montant): void
    {
        $operation = new Operation($montant, false, true);
        $this->solde = $this->solde - $montant;
        $this->addOperation($operation->get_operation());
    }

    public function getHistory(): array
    {
        return $this->arrOperation;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getSolde(): string
    {
        return $this->solde;
    }


    public static function getCurrentId(): int
    {
        return self::$idC;
    }

    public function __serialize()
    {
        return  [
            'id' => $this->id,
            'solde' => $this->solde,
            'operations' => $this->arrOperation,
        ];
    }

    public function __unserialize($data)
    {
        $this->id = $data['id'];
        $this->solde = $data['solde'];
        $this->arrOperation = $data['operations'];
    }
}

class CompteCourant extends Compte
{
    private $txDecouvert;

    public function __construct($montant, $tx)
    {
        parent::__construct($montant);
        $this->txDecouvert = $tx;
    }

    public function debit($montant): void
    {
        // FIX: pb whith operation class , add status to operation maybe
        if ($montant <= $this->solde + $this->txDecouvert) {
            $operation = new Operation($montant, false, true);
            $this->solde = $this->solde - $montant;
            $this->addOperation($operation->get_operation());
        } else {
            $operation = new Operation($montant, false, false);
            $this->addOperation($operation->get_operation());
        }
    }

    public function getInfoCompte(): object
    {
        return (object) [
            "id" => $this->id,
            "solde" => $this->solde,
            "typeCompte" => 'Courant',
            "tx" => $this->txDecouvert,
            "operations" => $this->arrOperation
        ];
    }

    public function __serialize()
    {
        return [
            'id' => $this->id,
            'solde' => $this->solde,
            "typeCompte" => 'Courant',
            "tx" => $this->txDecouvert,
            'operations' => $this->arrOperation,
        ];
    }

    public function __unserialize($data)
    {
        $this->id = $data['id'];
        $this->solde = $data['solde'];
        $this->txDecouvert = $data['tx'];
        $this->arrOperation = $data['operations'];
    }
}

class CompteEpargne extends Compte
{
    public function __construct($montant)
    {
        parent::__construct($montant);
    }

    public function debit($montant): void
    {
        if ($montant <= $this->solde) {
            $operation = new Operation($montant, false, true);
            $this->solde = $this->solde - $montant;
            $this->addOperation($operation->get_operation());
        } else {
            $operation = new Operation($montant, false, false);
            $this->addOperation($operation->get_operation());
        }
    }

    public function getInfoCompte(): object
    {
        return (object) [
            "id" => $this->id,
            "solde" => $this->solde,
            "typeCompte" => 'Epargne',
            "operations" => $this->arrOperation
        ];
    }
}
