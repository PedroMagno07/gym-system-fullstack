<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include "db.php";

try {
    $stmt = $pdo->query("
        SELECT plano_id, nome, preco, descricao 
        FROM Planos 
        WHERE nome IN ('Júnior', 'Pleno', 'Sênior')
        ORDER BY plano_id
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo json_encode(["erro" => $e->getMessage()]);
}
?>
