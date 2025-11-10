<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include("../db.php");

try {
    $stmt = $pdo->query("
        SELECT 
            u.usuario_id,
            u.nome,
            u.email,
            u.tipo_usuario,
            p.nome AS plano
        FROM Usuarios u
        LEFT JOIN Alunos a ON u.usuario_id = a.aluno_id
        LEFT JOIN Planos p ON a.plano_id = p.plano_id
        ORDER BY u.nome
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao listar usuários: " . $e->getMessage()]);
}
?>
