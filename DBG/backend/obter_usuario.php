<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["erro" => "ID não fornecido"]);
    exit;
}

$stmt = $pdo->prepare("
  SELECT 
    u.usuario_id,
    u.nome,
    u.email,
    u.tipo_usuario,
    u.cpf,
    u.telefone,
    u.data_criacao,
    u.foto_perfil,
    p.nome AS plano
  FROM usuarios u
  LEFT JOIN alunos a ON u.usuario_id = a.aluno_id
  LEFT JOIN planos p ON a.plano_id = p.plano_id
  WHERE u.usuario_id = ?
");
$stmt->execute([$id]);

$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$usuario) {
    echo json_encode(["erro" => "Usuário não encontrado"]);
    exit;
}

echo json_encode($usuario);
