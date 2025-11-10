<?php
session_start();

require '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario_login = $_POST['usuario'];
    $senha_login = $_POST['senha'];

    if (empty($usuario_login) || empty($senha_login)) {
        die("Preencha usuário e senha! <a href='javascript:history.back()'>Voltar</a>");
    }


    $sql = "SELECT u.usuario_id, u.nome, u.senha, u.tipo_usuario, a.plano_id
            FROM Usuarios u
            LEFT JOIN Alunos a ON u.usuario_id = a.aluno_id
            WHERE u.email = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$usuario_login]);
    $usuario_db = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario_db && password_verify($senha_login, $usuario_db['senha'])) {

        $_SESSION['usuario_id'] = $usuario_db['usuario_id'];
        $_SESSION['nome_usuario'] = $usuario_db['nome'];
        $_SESSION['tipo_usuario'] = $usuario_db['tipo_usuario'];
        $_SESSION['plano_id'] = $usuario_db['plano_id'];

       
        if ($usuario_db['tipo_usuario'] === 'admin') {
           
            header("Location: ../../frontend/admin/Dashboard-admin/index.html");
        } elseif ($usuario_db['tipo_usuario'] === 'professor') {
            
            header("Location: ../../frontend/professor/Dashboard-professor/index.html");
        } else {
         
            if (empty($usuario_db['plano_id'])) {
               
                header("Location: ../../frontend/aluno/dashboard-nao-aluno/dashboard.html");
            } else {
              
                header("Location: ../../frontend/aluno/Dashboard-aluno/index.html");
            }
        }
        exit;
    } else {

    header('Content-Type: text/html; charset=utf-8');
    
    echo "<script>alert('Usuário ou senha incorretos!'); window.history.back();</script>";
    exit;
}
}
?>