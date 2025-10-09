document.addEventListener('DOMContentLoaded', () => {
    // 1. Obter referências para os botões usando seus IDs
    const btnAgendar = document.getElementById('btn-agendar');
    const btnContato = document.getElementById('btn-contato'); // Agora está definido aqui!

    // --- Configuração do WhatsApp para o Botão Contato ---
    const numeroWhatsApp = '5568999162099'; 
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