<?php

session_start();


include '../db.php'; 


if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); // Erro "Não Autorizado"
    echo json_encode(['erro' => 'Usuário não autenticado.']);
    exit;
}


$id_usuario_logado = $_SESSION['usuario_id'];

try {

    $stmt = $pdo->prepare("
        SELECT 
            notificacao_id, 
            titulo, 
            conteudo, 
            data_envio, 
            lida 
        FROM 
            Notificacoes 
        WHERE 
            destinatario_id = ? 
        ORDER BY 
            data_envio DESC
    ");

    $stmt->execute([$id_usuario_logado]);
    $notificacoes = $stmt->fetchAll();

    echo json_encode($notificacoes);

} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(['erro' => 'Erro ao buscar notificações: ' . $e->getMessage()]);
}
?>