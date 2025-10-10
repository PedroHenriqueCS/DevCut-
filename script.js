document.addEventListener('DOMContentLoaded', () => {
    // 1. Obter referências para os botões usando seus IDs
    const btnAgendar = document.getElementById('btn-agendar');
    const btnContato = document.getElementById('btn-contato'); // Agora está definido aqui!

    // --- Configuração do WhatsApp para o Botão Contato ---
    const numeroWhatsApp = '556884279137'; 
    const textoMensagem = 'Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20corte%20na%20DevCut.';
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoMensagem}`;

    // 2. Funcionalidade do botão "Agendar Horário"
    btnAgendar.addEventListener('click', (event) => {
        event.preventDefault(); 
        
        // **arquivo da tela de login 
        window.location.href = 'agenda-online/agendar-corte-index.html'; 
        
        console.log('Botão Agendar Horário clicado. Redirecionando para a Tela-de-login/login-index.html.');
    });

    // 3. Funcionalidade do botão "Contato"
    btnContato.addEventListener('click', (event) => {
        event.preventDefault(); 
        
        // Abre o link do WhatsApp em uma nova aba
        window.open(linkWhatsApp, '_blank'); 
        
        console.log('Botão Contato clicado. Redirecionando para o WhatsApp.');
    });
});


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