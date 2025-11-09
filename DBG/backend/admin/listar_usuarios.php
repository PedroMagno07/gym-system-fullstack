<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include "db.php";

$stmt = $pdo->query("
  SELECT 
    u.usuario_id,
    u.nome,
    u.email,
    u.tipo_usuario,
    p.nome AS plano
  FROM usuarios u
  LEFT JOIN alunos a ON u.usuario_id = a.aluno_id
  LEFT JOIN planos p ON a.plano_id = p.plano_id
  ORDER BY u.nome
");

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
