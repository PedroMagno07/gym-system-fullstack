<?php
$DB_HOST = '127.0.0.1';
$DB_NAME = 'debug_fit_db';
$DB_USER = 'root';
$DB_PASS = ''; // padrão XAMPP

$dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4";

$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
  $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
  exit;
}

header('Content-Type: application/json; charset=utf-8');

function json_input() {
  $raw = file_get_contents('php://input');
  return $raw ? json_decode($raw, true) : [];
}
?>
