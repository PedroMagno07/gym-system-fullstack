<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

$id = $_POST['plano_id'] ?? null;
$preco = $_POST['preco'] ?? null;
$descricao = $_POST['descricao'] ?? null;

if (!$id) {
    echo json_encode(["erro" => "ID do plano não informado."]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE Planos SET preco = ?, descricao = ? WHERE plano_id = ?");
    $stmt->execute([$preco, $descricao, $id]);

    echo json_encode(["sucesso" => true]);
} catch (Exception $e) {
    echo json_encode(["erro" => $e->getMessage()]);
}
?>
