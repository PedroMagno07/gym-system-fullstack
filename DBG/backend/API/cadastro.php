<?php

require '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];

  
    if (empty($usuario) || empty($email) || empty($senha)) {
        die("Por favor, preencha todos os campos! <a href='javascript:history.back()'>Voltar</a>");
    }

    $stmt = $pdo->prepare("SELECT usuario_id FROM Usuarios WHERE nome = ? OR email = ?");
    $stmt->execute([$usuario, $email]);

    if ($stmt->rowCount() > 0) {
        die("Usuário ou Email já cadastrados! <a href='javascript:history.back()'>Voltar</a>");
    }

    try {
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
      
        $stmt = $pdo->prepare("INSERT INTO Usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, 'aluno')");
        $stmt->execute([$usuario, $email, $senha_hash]);


        $novo_usuario_id = $pdo->lastInsertId();


        $stmt_aluno = $pdo->prepare("INSERT INTO Alunos (aluno_id) VALUES (?)");
        $stmt_aluno->execute([$novo_usuario_id]);

     
        header("Location: ../../frontend/login/index.html");
        exit;
    } catch (Exception $e) {
        die("Erro ao cadastrar: " . $e->getMessage());
    }
}
?>