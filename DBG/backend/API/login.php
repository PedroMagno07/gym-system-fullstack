<?php
session_start();
require '../conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario_login = $_POST['usuario'];
    $senha_login = $_POST['senha'];

    if (empty($usuario_login) || empty($senha_login)) {
        die("Preencha usuário e senha! <a href='javascript:history.back()'>Voltar</a>");
    }

    // MUDANÇA AQUI: Usamos LEFT JOIN para já buscar o plano_id se ele for um aluno
    $sql = "SELECT u.usuario_id, u.nome, u.senha, u.tipo_usuario, a.plano_id
            FROM Usuarios u
            LEFT JOIN Alunos a ON u.usuario_id = a.aluno_id
            WHERE u.email = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$usuario_login]);
    $usuario_db = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario_db && password_verify($senha_login, $usuario_db['senha'])) {
        // Login sucesso!
        $_SESSION['usuario_id'] = $usuario_db['usuario_id'];
        $_SESSION['nome_usuario'] = $usuario_db['nome'];
        $_SESSION['tipo_usuario'] = $usuario_db['tipo_usuario'];
        // Salvamos o plano na sessão também, pode ser útil depois
        $_SESSION['plano_id'] = $usuario_db['plano_id'];

        // Lógica de Redirecionamento atualizada
        if ($usuario_db['tipo_usuario'] === 'admin') {
            header("Location: ../../frontend/dashboard-admin/index.html");
        } elseif ($usuario_db['tipo_usuario'] === 'professor') {
            header("Location: ../../frontend/dashboard-professor/index.html");
        } else {
            // É ALUNO. Vamos verificar se tem plano.
            if (empty($usuario_db['plano_id'])) {
                // SEM PLANO: Redireciona para a tela de escolha de planos
                header("Location: ../../frontend/escolher-plano/index.html");
            } else {
                // COM PLANO: Vai para o dashboard normal
                header("Location: ../../frontend/dashboard-aluno/index.html");
            }
        }
        exit;
    } else {
        echo "<script>alert('Usuário ou senha incorretos!'); window.history.back();</script>";
        exit;
    }
}
?>