<?php
// ... Credenciais do XAMPP:
$banco_de_dados = "devcut_barbearia"; // Novo nome do BD
// ...


if ($conexao->connect_error) {
    // Se a conexão falhou, mostra a mensagem de erro
    die("ERRO DE CONEXÃO COM O BANCO DE DADOS: " . $conexao->connect_error);
} else {
    // Se a conexão foi bem-sucedida
    echo "Conexão com o BD ('$banco_de_dados') estabelecida com SUCESSO!";
}

?>



