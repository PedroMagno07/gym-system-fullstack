<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
  http_response_code(405);
  echo json_encode(['erro' => 'Método não permitido']);
  exit;
}

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
  http_response_code(400);
  echo json_encode(['erro' => 'ID inválido']);
  exit;
}

try {
  $stmt = $pdo->prepare("DELETE FROM Notificacoes WHERE notificacao_id = ?");
  $stmt->execute([$id]);

  if ($stmt->rowCount() > 0) {
    echo json_encode(['ok' => true]);
  } else {
    http_response_code(404);
    echo json_encode(['erro' => 'Notificação não encontrada']);
  }
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['erro' => 'Erro ao excluir notificação: ' . $e->getMessage()]);
}
?>
