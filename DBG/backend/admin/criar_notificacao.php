<?php
require __DIR__ . '/db.php';
$data = json_input();

$titulo        = trim($data['titulo'] ?? '');
$destinatarios = trim($data['destinatarios'] ?? '');
$conteudo      = trim($data['conteudo'] ?? '');

if ($titulo === '' || $destinatarios === '' || $conteudo === '') {
  http_response_code(400);
  echo json_encode(['erro' => 'Campos obrigatórios ausentes']);
  exit;
}

try {
  $pdo->beginTransaction();
  $targets = [];

  $lower = strtolower($destinatarios);
  if (in_array($lower, ['aluno','professor','admin','todos'])) {
    if ($lower === 'todos') {
      $targets = $pdo->query("SELECT usuario_id FROM Usuarios")->fetchAll(PDO::FETCH_COLUMN);
    } else {
      $stmt = $pdo->prepare("SELECT usuario_id FROM Usuarios WHERE tipo_usuario = ?");
      $stmt->execute([$lower]);
      $targets = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
  } else {
    $parts = array_filter(array_map('trim', explode(',', $destinatarios)));
    foreach ($parts as $p) {
      if (ctype_digit($p)) $targets[] = (int)$p;
      else {
        $s = $pdo->prepare("SELECT usuario_id FROM Usuarios WHERE email = ?");
        $s->execute([$p]);
        if ($r = $s->fetch()) $targets[] = $r['usuario_id'];
      }
    }
  }

  $insert = $pdo->prepare("
    INSERT INTO Notificacoes (remetente_id, destinatario_id, titulo, conteudo)
    VALUES (NULL, ?, ?, ?)
  ");
  foreach ($targets as $uid) {
    $insert->execute([$uid, $titulo, $conteudo]);
  }

  $pdo->commit();
  echo json_encode(['mensagem' => 'Notificação criada com sucesso']);
} catch (Throwable $e) {
  $pdo->rollBack();
  http_response_code(500);
  echo json_encode(['erro' => $e->getMessage()]);
}
?>
