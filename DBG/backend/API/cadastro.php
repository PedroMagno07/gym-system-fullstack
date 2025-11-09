<?php
// CORREÇÃO: Nome do arquivo é db.php, não conexao.php
require '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // Validação simples
    if (empty($usuario) || empty($email) || empty($senha)) {
        die("Por favor, preencha todos os campos! <a href='javascript:history.back()'>Voltar</a>");
    }

    // Verifica duplicados usando a coluna 'nome'
    $stmt = $pdo->prepare("SELECT usuario_id FROM Usuarios WHERE nome = ? OR email = ?");
    $stmt->execute([$usuario, $email]);

    if ($stmt->rowCount() > 0) {
        die("Usuário ou Email já cadastrados! <a href='javascript:history.back()'>Voltar</a>");
    }

    // Insere o novo aluno
    try {
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
        // Define 'aluno' como tipo padrão
        $stmt = $pdo->prepare("INSERT INTO Usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, 'aluno')");
        $stmt->execute([$usuario, $email, $senha_hash]);

        // Pega o ID do usuário recém-criado
        $novo_usuario_id = $pdo->lastInsertId();

        // Insere também na tabela específica de Alunos
        $stmt_aluno = $pdo->prepare("INSERT INTO Alunos (aluno_id) VALUES (?)");
        $stmt_aluno->execute([$novo_usuario_id]);

        // Redireciona para o login (Caminho já estava correto: sobe API, sobe backend, entra frontend/login)
        header("Location: ../../frontend/login/index.html");
        exit;
    } catch (Exception $e) {
        die("Erro ao cadastrar: " . $e->getMessage());
    }
}
?>