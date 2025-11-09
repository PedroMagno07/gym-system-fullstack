<?php
session_start();
// CORREÇÃO: db.php está um nível acima
include '../db.php';

// Pega o JSON enviado (ex: {"id": 123})
$data = json_input();
$notificacao_id = $data['id'] ?? 0;

// Validação de segurança
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
    // Atualiza a notificação
    // A condição "AND destinatario_id = ?" é uma
    // camada extra de segurança para garantir que
    // o usuário só possa marcar as SUAS PRÓPRIAS notificações.
    $stmt = $pdo->prepare("
        UPDATE Notificacoes 
        SET lida = 1 
        WHERE notificacao_id = ? AND destinatario_id = ?
    ");
    
    $stmt->execute([$notificacao_id, $id_usuario_logado]);

    // Verifica se alguma linha foi de fato atualizada
    if ($stmt->rowCount() > 0) {
        echo json_encode(['sucesso' => true]);
    } else {
        // Isso pode acontecer se a notificação não pertencer ao usuário
        echo json_encode(['sucesso' => false, 'mensagem' => 'Notificação não encontrada ou não autorizada']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => $e->getMessage()]);
}
?>