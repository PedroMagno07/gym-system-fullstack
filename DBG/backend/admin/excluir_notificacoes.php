<?php
require __DIR__ . '/db.php';
$data = json_input();

$id = (int)($data['id'] ?? 0);
if (!$id) {
  http_response_code(400);
  echo json_encode(['erro' => 'ID inválido']);
  exit;
}

$stmt = $pdo->prepare("DELETE FROM Notificacoes WHERE notificacao_id=?");
$stmt->execute([$id]);

echo json_encode(['mensagem' => 'Excluído com sucesso']);
?>
