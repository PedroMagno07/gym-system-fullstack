<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../db.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$titulo = trim($data['titulo'] ?? '');
$conteudo = trim($data['conteudo'] ?? '');
$destinatarios = trim($data['destinatarios'] ?? '');

if ($titulo === '' || $conteudo === '' || $destinatarios === '') {
  http_response_code(400);
  echo json_encode(['erro' => 'Campos obrigatórios ausentes']);
  exit;
}

try {
  $stmt = $pdo->prepare("
    INSERT INTO Notificacoes (remetente_id, destinatario_id, titulo, conteudo, destinatarios)
    VALUES (NULL, NULL, ?, ?, ?)
  ");
  $stmt->execute([$titulo, $conteudo, $destinatarios]);
  echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['erro' => 'Erro ao criar notificação: ' . $e->getMessage()]);
}
