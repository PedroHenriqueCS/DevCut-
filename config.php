<?php

// 1. Credenciais de conexão do XAMPP:
$servidor = "localhost";
$usuario = "root";       
$senha = "";             
$banco_de_dados = "devcut_barbearia"; // Novo nome do BD

// 2. Tenta estabelecer a conexão (use a classe new mysqli)
$conexao = new mysqli($servidor, $usuario, $senha, $banco_de_dados);

// 3. Verifica se a conexão falhou
if ($conexao->connect_error) {
    // Se falhar, interrompe o script e mostra o erro
    die("Falha na conexão: " . $conexao->connect_error);
}

// 4. (Recomendado) Define o charset
$conexao->set_charset("utf8");

// IMPORTANTE: Remova qualquer comando 'echo' que você usou para o teste.

?>


