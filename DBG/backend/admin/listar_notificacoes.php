<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../db.php';



try {
  $sql = "SELECT 
            notificacao_id,
            titulo,
            conteudo,
            destinatarios,
            data_envio
          FROM Notificacoes
          ORDER BY data_envio DESC
          LIMIT 100";
  $stmt = $pdo->query($sql);
  echo json_encode($stmt->fetchAll());
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['erro' => 'Erro ao listar notificações: ' . $e->getMessage()]);
}
