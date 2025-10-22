// --- FUNÇÕES HELPER (Auxiliares) ---


/**
 * Remove todas as opções do select de horários.
 */
function limparHorarios() {
    const selectHora = document.getElementById('hora');
    // Remove todas as opções
    while (selectHora.options.length > 0) {
        selectHora.remove(0);
    }
}

/**
 * Gera horários de 30 em 30 minutos, das 08:00 às 17:00.
 */
function carregarHorariosDisponiveis() {
    const selectHora = document.getElementById('hora');
    
    limparHorarios();

    const horaInicio = 8; 
    const horaFim = 17; 
    const intervalo = 30; 

    // Adiciona a primeira opção "Selecione"
    const optionSelecione = document.createElement('option');
    optionSelecione.value = '';
    optionSelecione.textContent = 'Selecione um Horário';
    selectHora.appendChild(optionSelecione);

    for (let hora = horaInicio; hora < horaFim; hora++) {
        for (let minuto = 0; minuto < 60; minuto += intervalo) {
            if (hora === horaFim - 1 && minuto >= 60 - intervalo) {
                break; 
            }
            
            const horaFormatada = String(hora).padStart(2, '0');
            const minutoFormatado = String(minuto).padStart(2, '0');
            const horario = `${horaFormatada}:${minutoFormatado}`;

            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario;

            selectHora.appendChild(option);
        }
    }
}

// --- FUNÇÃO DE FOTO DO BARBEIRO ---
function mostrarFotoBarbeiro() {
    const selectBarbeiro = document.getElementById('barbeiro');
    const fotoBarbeiro = document.getElementById('barbeiro-foto');
    const mensagemSelecao = document.getElementById('mensagem-selecao');
    const fotoUrl = selectBarbeiro.options[selectBarbeiro.selectedIndex].getAttribute('data-foto');

    if (fotoUrl) {
        fotoBarbeiro.src = fotoUrl;
        fotoBarbeiro.style.display = 'block';
        mensagemSelecao.style.display = 'none';
        carregarHorariosDisponiveis(); 
    } else {
        fotoBarbeiro.style.display = 'none';
        fotoBarbeiro.src = ''; 
        mensagemSelecao.style.display = 'block';
        limparHorarios();
    }
}



// --- INICIALIZAÇÃO E LISTENERS (DOMContentLoaded UNIFICADO) ---


document.addEventListener('DOMContentLoaded', () => {
    
    // --- GERAIS (Botões da Página Principal) ---
    const btnAgendar = document.getElementById('btn-agendar');
    const btnContato = document.getElementById('btn-contato'); 

    // Configuração do WhatsApp
    const numeroWhatsApp = '556884279137'; 
    const textoMensagem = 'Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20corte%20na%20DevCut.';
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoMensagem}`;

    // Funcionalidade do botão "Agendar Horário"
    if (btnAgendar) {
         btnAgendar.addEventListener('click', (event) => {
            event.preventDefault(); 
            // ATENÇÃO: Se você moveu 'agendar-corte-index.html' para a raiz, mude o caminho abaixo:
            window.location.href = 'agendar-corte-index.html'; 
        });
    }

    // Funcionalidade do botão "Contato"
    if (btnContato) {
        btnContato.addEventListener('click', (event) => {
            event.preventDefault(); 
            window.open(linkWhatsApp, '_blank'); 
            console.log('Botão Contato clicado. Redirecionando para o WhatsApp.');
        });
    }
    
    // --- LÓGICA DO FORMULÁRIO (Agendamento) ---
    const selectBarbeiro = document.getElementById('barbeiro');
    const inputData = document.getElementById('data');
    const formAgendamento = document.getElementById('form-agendamento');
    
    // 1. Listeners para a interatividade do formulário
    if (selectBarbeiro) {
        selectBarbeiro.addEventListener('change', mostrarFotoBarbeiro);
        carregarHorariosDisponiveis(); // Carga inicial
    }
    if (inputData) {
        inputData.addEventListener('change', carregarHorariosDisponiveis);
    }
    
    // 2. Listener para o ENVIO do Formulário (Onde a mágica do BD acontece)
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', function(event) {
            
            event.preventDefault(); 

            // Coleta os valores de todos os campos
            const nome = document.getElementById('nome').value;
            const barbeiroId = selectBarbeiro.value;
            const barbeiroNome = selectBarbeiro.options[selectBarbeiro.selectedIndex].textContent;
            const data = inputData.value;
            const hora = document.getElementById('hora').value;

            // Validação básica
            if (!nome || !barbeiroId || !data || !hora) {
                alert('Por favor, preencha todos os campos do agendamento.');
                return; 
            }

            // Prepara os dados para envio
            const dadosParaEnvio = { 
                nome_cliente: nome, 
                servico: barbeiroNome, // Usando o nome do barbeiro como serviço
                data: data, 
                hora: hora 
            };

            // Envia os dados para o PHP (salvar_agendamento.php)
            fetch('salvar_agendamento.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaEnvio)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição: ' + response.statusText);
                }
                return response.json(); 
            })
            .then(data => {
                // Se o PHP retornar sucesso
                if (data.status === 'success') {
                    alert(`✅ Agendamento de ${nome} com ${barbeiroNome} confirmado e SALVO no BD!`);
                    formAgendamento.reset(); // Limpa o formulário
                } else {
                    // Se o PHP retornar status "error"
                    alert(`❌ Erro do servidor ao salvar: ${data.message}`);
                    console.error('Erro de servidor:', data.message);
                }
            })
            .catch(error => {
                // Captura erros de rede ou a exceção
                alert('❌ Erro de comunicação com o servidor. Verifique o console.');
                console.error('Erro de envio (Fetch):', error);
            });
        });
    } // Fim do if (formAgendamento)
    
});