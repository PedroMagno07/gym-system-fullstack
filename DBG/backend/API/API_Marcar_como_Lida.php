<?php
session_start();

include '../db.php';


$data = json_input();
$notificacao_id = $data['id'] ?? 0;


if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Não autenticado']);
    exit;
}
if (empty($notificacao_id)) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID da notificação não fornecido']);
    exit;
}

$id_usuario_logado = $_SESSION['usuario_id'];

try {
  
    $stmt = $pdo->prepare("
        UPDATE Notificacoes 
        SET lida = 1 
        WHERE notificacao_id = ? AND destinatario_id = ?
    ");
    
    $stmt->execute([$notificacao_id, $id_usuario_logado]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['sucesso' => true]);
    } else {

        echo json_encode(['sucesso' => false, 'mensagem' => 'Notificação não encontrada ou não autorizada']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => $e->getMessage()]);
}
?>