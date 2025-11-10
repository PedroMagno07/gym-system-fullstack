<?php

session_start();
include '../db.php'; 

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); 
    echo json_encode(['erro' => 'Usuário não autenticado. Faça login novamente.']);
    exit;s
}

if (!isset($_SESSION['tipo_usuario']) || $_SESSION['tipo_usuario'] !== 'aluno') {
    http_response_code(403); /
    echo json_encode(['erro' => 'Apenas alunos podem solicitar mudanças de treino.']);
    exit;
}

$aluno_id = $_SESSION['usuario_id']; 
$nome_aluno = $_SESSION['nome_usuario'] ?? 'Aluno'; 
$data = json_input();
$mensagem = $data['mensagem'] ?? null;

if (empty($mensagem) || trim($mensagem) === '') {
    http_response_code(400); 
    echo json_encode(['erro' => 'A mensagem de solicitação não pode estar vazia.']);
    exit;
}

try {
    $pdo->beginTransaction();

 
    $stmtSolic = $pdo->prepare("
        INSERT INTO Solicitacoes_Mudanca (aluno_id, descricao, status) 
        VALUES (?, ?, 'Pendente')
    ");
    $stmtSolic->execute([$aluno_id, $mensagem]);
    

    if ($nome_aluno === 'Aluno') {
        $stmtNome = $pdo->prepare("SELECT nome FROM Usuarios WHERE usuario_id = ?");
        $stmtNome->execute([$aluno_id]);
        $nome_aluno = $stmtNome->fetchColumn() ?: 'Aluno';
    }


    $stmtProf = $pdo->prepare("SELECT usuario_id FROM Usuarios WHERE tipo_usuario = 'professor'");
    $stmtProf->execute();
    $professores_ids = $stmtProf->fetchAll(PDO::FETCH_COLUMN);

    if (count($professores_ids) > 0) {
      
        $titulo_notif = "Nova Solicitação de Treino";
        $conteudo_notif = "O aluno '$nome_aluno' (ID: $aluno_id) enviou uma nova solicitação de mudança de treino.";

        $stmtNotif = $pdo->prepare("
            INSERT INTO Notificacoes (remetente_id, destinatario_id, titulo, conteudo, lida)
            VALUES (?, ?, ?, ?, 0)
        ");

    
        foreach ($professores_ids as $prof_id) {
            $stmtNotif->execute([
                $aluno_id,         
                $prof_id,          
                $titulo_notif,
                $conteudo_notif
            ]);
        }
    }
    
 
    $pdo->commit();
    echo json_encode(['sucesso' => true, 'mensagem' => 'Solicitação enviada com sucesso! O professor foi notificado.']);

} catch (PDOException $e) {
    $pdo->rollBack(); 
    http_response_code(500); 
    echo json_encode(['erro' => 'Erro ao salvar os dados: ' . $e->getMessage()]);
}

?>