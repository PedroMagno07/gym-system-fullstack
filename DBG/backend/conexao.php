<?php
// conexao.php
$host = 'localhost';
$dbname = 'debug_fit_db';
$username = 'root'; // Seu usuário do MySQL (geralmente 'root' em local)
$password = '';     // Sua senha do MySQL (geralmente vazia em local)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["sucesso" => false, "mensagem" => "Erro de conexão: " . $e->getMessage()]));
}
?>