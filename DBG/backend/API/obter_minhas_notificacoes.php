<?php
// 1. INICIA A SESSÃO
// Isso é crucial para sabermos quem está logado
session_start();

// Inclui sua conexão com o banco
include '../db.php'; 

// 2. VERIFICAÇÃO DE SEGURANÇA
// Se não houver um 'usuario_id' na sessão, o usuário não está logado.
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); // Erro "Não Autorizado"
    echo json_encode(['erro' => 'Usuário não autenticado.']);
    exit;
}

// 3. BUSCA SEGURA
// Pega o ID do usuário que está na sessão
$id_usuario_logado = $_SESSION['usuario_id'];

try {
    // 4. PREPARA A QUERY SQL
    // Seleciona todas as notificações ONDE o destinatário é o usuário logado
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

    // 5. EXECUTA E RETORNA
    $stmt->execute([$id_usuario_logado]);
    $notificacoes = $stmt->fetchAll();

    echo json_encode($notificacoes);

} catch (PDOException $e) {
    http_response_code(500); // Erro de servidor
    echo json_encode(['erro' => 'Erro ao buscar notificações: ' . $e->getMessage()]);
}
?>