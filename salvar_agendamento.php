<?php
// Arquivo: salvar_agendamento.php

// A primeira linha pressupõe que 'config.php' existe e define a variável $conexao
include 'config.php'; 

// Define o cabeçalho para retornar JSON
header('Content-Type: application/json');

// Garante que a requisição veio via POST (do JavaScript)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    // Recebe os dados JSON crus
    $json_data = file_get_contents("php://input");
    $dados = json_decode($json_data, true);

    // 1. Verifica se o JSON foi decodificado corretamente
    if ($dados === null) {
        http_response_code(400); // Bad Request
        echo json_encode(["status" => "error", "message" => "Dados JSON inválidos ou ausentes."]);
        exit;
    }

    // 2. Coleta e sanitiza os dados (USANDO A CHAVE 'servico' COMO CORRIGIDO)
    $nome_cliente = $conexao->real_escape_string($dados['nome_cliente'] ?? '');
    $barbeiro_servico = $conexao->real_escape_string($dados['servico'] ?? ''); // Lendo a chave 'servico' do JS
    $data = $conexao->real_escape_string($dados['data'] ?? '');
    $hora = $conexao->real_escape_string($dados['hora'] ?? '');

    // 3. Validação básica no lado do servidor
    if (empty($nome_cliente) || empty($barbeiro_servico) || empty($data) || empty($hora)) {
        http_response_code(400); // Bad Request
        echo json_encode(["status" => "error", "message" => "Todos os campos do agendamento são obrigatórios."]);
        exit;
    }

    // Combina data e hora para a coluna DATETIME do MySQL
    $data_hora_agendamento = $data . ' ' . $hora; 

    // Comando SQL para inserir os dados
    $sql = "INSERT INTO agendamentos (nome_cliente, servico, data_hora) VALUES (?, ?, ?)";
    
    // Prepara a query (proteção contra SQL Injection)
    $stmt = $conexao->prepare($sql);

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Erro ao preparar a query: " . $conexao->error]);
        exit;
    }
    
    // Liga os parâmetros (três strings: nome_cliente, barbeiro_servico, data_hora_agendamento)
    $stmt->bind_param("sss", $nome_cliente, $barbeiro_servico, $data_hora_agendamento);

    if ($stmt->execute()) {
        // Resposta de sucesso 
        echo json_encode(["status" => "success", "message" => "Agendamento salvo no BD com sucesso!"]);
    } else {
        // Resposta de erro do banco de dados
        http_response_code(500); 
        echo json_encode(["status" => "error", "message" => "Erro ao salvar no banco de dados: " . $stmt->error]);
    }

    $stmt->close();

} else {
    // Método não permitido
    http_response_code(405); 
    echo json_encode(["status" => "error", "message" => "Método não permitido."]);
}

// Fecha a conexão
if (isset($conexao)) {
    $conexao->close();
}
?>