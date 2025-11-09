<?php
require __DIR__ . '/db.php';
$data = json_input();

$id = (int)($data['id'] ?? 0);
$titulo = trim($data['titulo'] ?? '');
$conteudo = trim($data['conteudo'] ?? '');

if (!$id || !$titulo || !$conteudo) {
  http_response_code(400);
  echo json_encode(['erro' => 'Campos obrigatórios ausentes']);
  exit;
}

$stmt = $pdo->prepare("UPDATE Notificacoes SET titulo=?, conteudo=? WHERE notificacao_id=?");
$stmt->execute([$titulo, $conteudo, $id]);

echo json_encode(['mensagem' => 'Atualizado com sucesso']);
?>
