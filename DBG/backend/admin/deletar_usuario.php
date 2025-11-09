<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["usuario_id"] ?? null;

if (!$id) { echo json_encode(["erro" => "ID não informado"]); exit; }

$stmt = $pdo->prepare("DELETE FROM usuarios WHERE usuario_id = ?");
$stmt->execute([$id]);

echo json_encode(["mensagem" => "Usuário excluído com sucesso"]);
?>
