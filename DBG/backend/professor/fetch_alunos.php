<?php
require __DIR__ . '/../db.php';
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

try {
    $sql = "
        SELECT 
            U.usuario_id, 
            U.nome, 
            U.email, 
            P.nome AS nome_plano
        FROM Usuarios U
        JOIN Alunos A ON U.usuario_id = A.aluno_id
        JOIN Planos P ON A.plano_id = P.plano_id
        WHERE U.tipo_usuario = 'aluno'
        ORDER BY U.nome
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $alunos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($alunos) {
        echo json_encode(["success" => true, "data" => $alunos]);
    } else {
        echo json_encode(["success" => true, "data" => [], "message" => "Nenhum aluno encontrado."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro interno no servidor ao listar alunos."]);
}
?>