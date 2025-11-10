<?php
include "../db.php";
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=UTF-8');

$usuario_id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$usuario_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID do usuário inválido ou não fornecido na URL."]);
    exit();
}

try {
    $stmt_tipo = $pdo->prepare("SELECT tipo_usuario FROM Usuarios WHERE usuario_id = :id_usuario");
    $stmt_tipo->bindParam(':id_usuario', $usuario_id, PDO::PARAM_INT);
    $stmt_tipo->execute();
    $tipo_usuario = $stmt_tipo->fetchColumn();

    if (!$tipo_usuario) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Usuário não encontrado."]);
        exit();
    }

    $sql = "";
    $select_extra = ""; 
    if ($tipo_usuario === 'aluno') {
        $select_extra = ", P.nome AS plano, A.data_matricula";
        $join = "JOIN Alunos A ON U.usuario_id = A.aluno_id JOIN Planos P ON A.plano_id = P.plano_id";
    } elseif ($tipo_usuario === 'professor') {
        $select_extra = ", T.cref, T.data_contratacao"; 
        $join = "JOIN Professores T ON U.usuario_id = T.professor_id";
    } elseif ($tipo_usuario === 'admin') {
        $select_extra = ", D.nivel_acesso"; 
        $join = "JOIN Admins D ON U.usuario_id = D.admin_id";
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Tipo de usuário não suportado."]);
        exit();
    }
    $sql = "
        SELECT 
            U.nome, 
            U.email AS gmail, 
            U.telefone, 
            U.cpf, 
            DATE_FORMAT(U.data_criacao, '%d/%m/%Y') AS data_criacao,
            U.tipo_usuario
            {$select_extra}
        FROM Usuarios U
        {$join}
        WHERE U.usuario_id = :id_usuario
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id_usuario', $usuario_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $perfil = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($perfil) {
        echo json_encode(["success" => true, "tipo_usuario" => $tipo_usuario, "data" => $perfil]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Inconsistência de dados: Perfil não encontrado na tabela de especialização."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro interno no servidor ao buscar perfil: " . $e->getMessage()]);
}
?>