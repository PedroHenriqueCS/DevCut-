<?php
// Inclui a conexão com o banco de dados
include 'config.php';

// Garante que a requisição veio via POST (do JavaScript)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Recebe os dados JSON (se seu JS estiver enviando JSON)
    $json_data = file_get_contents("php://input");
    $dados = json_decode($json_data, true);

    // Certifique-se que os nomes das chaves (e.g., 'nome_cliente')
    // correspondem aos dados que seu JS envia.
    $nome_cliente = $conexao->real_escape_string($dados['nome_cliente'] ?? '');
    $barbeiro = $conexao->real_escape_string($dados['barbeiro'] ?? ''); 
    $data = $conexao->real_escape_string($dados['data'] ?? '');
    $hora = $conexao->real_escape_string($dados['hora'] ?? '');

    // Combina data e hora para a coluna DATETIME do MySQL
    $data_hora_agendamento = $data . ' ' . $hora; 

    // Comando SQL para inserir os dados
    $sql = "INSERT INTO agendamentos (nome_cliente, servico, data_hora) VALUES (?, ?, ?)";
    // ATENÇÃO: Se sua tabela 'agendamentos' tem mais colunas (como 'telefone'),
    // você deve incluí-las aqui e no JS.

    // Prepara a query (proteção contra SQL Injection)
    $stmt = $conexao->prepare($sql);
    // O tipo dos parâmetros deve ser ajustado (s = string)
    $stmt->bind_param("sss", $nome_cliente, $barbeiro, $data_hora_agendamento);

    if ($stmt->execute()) {
        // Resposta de sucesso (o JS pode ler isso)
        echo json_encode(["status" => "success", "message" => "Agendamento salvo no BD."]);
    } else {
        // Resposta de erro
        http_response_code(500); // Define o código HTTP como erro
        echo json_encode(["status" => "error", "message" => "Erro ao salvar: " . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(405); // Método não permitido
    echo json_encode(["status" => "error", "message" => "Método não permitido."]);
}
$conexao->close();
?>