<?php
header('Content-Type: application/json');
// CORREÇÃO: db.php está um nível acima
require '../db.php'; 

$response = [
    'planos' => [],
    'usuarios' => [],
    'receita' => [] 
];

try {

    $stmtPlanos = $pdo->query("
        SELECT p.nome, COUNT(a.aluno_id) as total 
        FROM Planos p 
        LEFT JOIN Alunos a ON p.plano_id = a.plano_id 
        GROUP BY p.plano_id, p.nome
    ");
    $planosData = $stmtPlanos->fetchAll(PDO::FETCH_ASSOC);
    

    $totalAlunosPlanos = array_sum(array_column($planosData, 'total'));
    foreach ($planosData as $plano) {
        $response['planos']['labels'][] = strtoupper($plano['nome']);
        $response['planos']['data'][] = $plano['total'];
        $porcentagem = $totalAlunosPlanos > 0 ? round(($plano['total'] / $totalAlunosPlanos) * 100) : 0;
        $response['planos']['percent'][] = $porcentagem;
    }


    $stmtUsuarios = $pdo->query("SELECT tipo_usuario, COUNT(*) as total FROM Usuarios GROUP BY tipo_usuario");
    $usuariosData = $stmtUsuarios->fetchAll(PDO::FETCH_KEY_PAIR); 

    $tipos = ['aluno', 'professor', 'admin'];
    $totalUsuarios = array_sum($usuariosData);
    
    foreach ($tipos as $tipo) {
        $qtd = $usuariosData[$tipo] ?? 0;
        $response['usuarios']['labels'][] = strtoupper($tipo . 'S'); 
        $response['usuarios']['data'][] = $qtd;
        $response['usuarios']['percent'][] = $totalUsuarios > 0 ? round(($qtd / $totalUsuarios) * 100) : 0;
    }


    $response['receita']['labels'] = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI'];
    $response['receita']['data'] = [14000, 15000, 16000, 15500, 17000]; 

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar dados: ' . $e->getMessage()]);
}
?>