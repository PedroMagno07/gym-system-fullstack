<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

try {
    $stmt = $pdo->query("
        SELECT 
            notificacao_id,
            titulo,
            conteudo,
            destinatarios,
            data_envio
        FROM notificacoes
        ORDER BY data_envio DESC
    ");

    $notificacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notificacoes);
} catch (PDOException $e) {
    echo json_encode(["erro" => $e->getMessage()]);
}
?>
