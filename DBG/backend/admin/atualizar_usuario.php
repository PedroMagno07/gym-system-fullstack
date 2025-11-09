<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

$id = $_POST['usuario_id'] ?? null;

if (!$id) {
    echo json_encode(["erro" => "ID não informado"]);
    exit;
}

try {
    // Upload da imagem, se enviada
    $foto_perfil = null;
    if (!empty($_FILES['foto']['name'])) {
        $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
        $novoNome = "foto_" . $id . "." . strtolower($ext);
        $destino = __DIR__ . "/../uploads/" . $novoNome;

        // Cria pasta se não existir
        if (!file_exists(__DIR__ . "/../uploads")) {
            mkdir(__DIR__ . "/../uploads", 0777, true);
        }
            file_put_contents(__DIR__ . "/../uploads/log.txt", print_r($_FILES, true));

        if (move_uploaded_file($_FILES['foto']['tmp_name'], $destino)) {
            $foto_perfil = "uploads/" . $novoNome;
        }
    }

    // Atualiza nome e foto (outros campos podem ser adicionados conforme necessário)
    $sql = "UPDATE usuarios 
            SET 
              nome = COALESCE(?, nome),
              email = COALESCE(?, email),
              cpf = COALESCE(?, cpf),
              tipo_usuario = COALESCE(?, tipo_usuario),
              foto_perfil = COALESCE(?, foto_perfil)
            WHERE usuario_id = ?";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $_POST['nome'] ?? null,
        $_POST['email'] ?? null,
        $_POST['cpf'] ?? null,
        $_POST['tipo_usuario'] ?? null,
        $foto_perfil,
        $id
    ]);

    echo json_encode(["sucesso" => true]);
} catch (Exception $e) {
    echo json_encode(["erro" => $e->getMessage()]);
}
