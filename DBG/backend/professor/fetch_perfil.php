<?php
include "../db.php"; 
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=UTF-8');

$aluno_id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$aluno_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID do aluno inválido ou não fornecido na URL."]);
    exit();
}

try {
    $sql = "
        SELECT 
            U.nome, 
            U.email AS gmail, 
            U.telefone, 
            U.cpf, 
            DATE_FORMAT(U.data_criacao, '%d/%m/%Y') AS data_criacao,
            P.nome AS plano
        FROM Usuarios U
        JOIN Alunos A ON U.usuario_id = A.aluno_id
        JOIN Planos P ON A.plano_id = P.plano_id
        WHERE U.usuario_id = :id_aluno
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id_aluno', $aluno_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $perfil = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($perfil) {
        echo json_encode(["success" => true, "data" => $perfil]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Perfil do aluno não encontrado."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro interno no servidor ao buscar perfil."]);
}
?>