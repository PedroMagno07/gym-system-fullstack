<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include("../db.php");

try {
    $stmt = $pdo->query("
        SELECT plano_id, nome, preco, descricao 
        FROM Planos 
        WHERE nome IN ('Júnior', 'Pleno', 'Sênior')
        ORDER BY plano_id
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao listar planos: " . $e->getMessage()]);
}
?>
