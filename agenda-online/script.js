/**
 * Função responsável por exibir a foto do barbeiro selecionado
 * com base no atributo 'data-foto' da opção do <select>.
 */
function mostrarFotoBarbeiro() {
    // Pega as referências dos elementos HTML que vamos manipular
    const selectBarbeiro = document.getElementById('barbeiro');
    const imgFoto = document.getElementById('barbeiro-foto');
    const mensagem = document.getElementById('mensagem-selecao');
    
    // Obtém a opção que está selecionada no momento
    const opcaoSelecionada = selectBarbeiro.options[selectBarbeiro.selectedIndex];
    
    // Pega o caminho da foto que foi armazenado no atributo 'data-foto'
    const caminhoFoto = opcaoSelecionada.getAttribute('data-foto');
    
    // Verifica se um barbeiro válido foi selecionado (ou seja, se a opção não é vazia)
    if (caminhoFoto && opcaoSelecionada.value !== "") {
        // Se a foto existir, define o caminho e mostra a imagem
        imgFoto.src = caminhoFoto;
        imgFoto.style.display = 'block'; // Torna a imagem visível
        mensagem.style.display = 'none';  // Esconde a mensagem de seleção
    } else {
        // Se a opção padrão ("Selecione um Barbeiro") estiver selecionada
        imgFoto.src = ""; // Limpa a fonte da imagem
        imgFoto.style.display = 'none';  // Esconde a imagem
        mensagem.style.display = 'block'; // Mostra a mensagem de seleção
    }
}