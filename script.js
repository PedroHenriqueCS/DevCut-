// --- FUNÇÕES HELPER (Auxiliares) ---


/**
 * Remove todas as opções do select de horários.
 */
function limparHorarios() {
    const selectHora = document.getElementById('hora');
    if (!selectHora) return; // Garante que o elemento existe

    // Remove todas as opções
    while (selectHora.options.length > 0) {
        selectHora.remove(0);
    }
}

/**
 * Gera horários de 30 em 30 minutos, das 08:00 às 17:00.
 * ATENÇÃO: Esta função *não* verifica conflitos de agendamento no BD.
 */
function carregarHorariosDisponiveis() {
    const selectHora = document.getElementById('hora');
    
    if (!selectHora) return;

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
            // Garante que não ultrapasse a horaFim (17:00)
            if (hora === horaFim - 1 && minuto >= 60 - intervalo) {
                break; 
            }
            
            const horaFormatada = String(hora).padStart(2, '0');
            const minutoFormatado = String(minuto).padStart(2, '0');
            const horario = `${horaFormatada}:${minutoFormatado}:00`; // Incluir segundos (00) para o MySQL

            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario.substring(0, 5); // Exibe HH:MM
            
            selectHora.appendChild(option);
        }
    }
}

// --- FUNÇÃO DE FOTO DO BARBEIRO ---
function mostrarFotoBarbeiro() {
    const selectBarbeiro = document.getElementById('barbeiro');
    const fotoBarbeiro = document.getElementById('barbeiro-foto');
    const mensagemSelecao = document.getElementById('mensagem-selecao');

    if (!selectBarbeiro || !fotoBarbeiro || !mensagemSelecao) return;

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


/*--- Função do Modal ---*/
/* Abre o Modal com Mensagem Especifica */
function abrirModal(mensagem) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');

    if (overlay && modal && modalMessage) {
        modalMessage.textContent = mensagem; // Define a mensagem dinâmica
        overlay.style.display = 'block';
        modal.style.display = 'block';
    }
}

/**
 * Fecha o modal de confirmação e limpa o formulário.
 */
function fecharModal() {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('custom-modal');
    const formAgendamento = document.getElementById('form-agendamento');

    if (overlay && modal) {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    }

    // Limpa o formulário e recarrega os horários APÓS fechar o modal
    if (formAgendamento) {
        formAgendamento.reset();
        // Chama a função para resetar a foto do barbeiro e os horários
        mostrarFotoBarbeiro(); 
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

    // --- (NOVO) Listeners do Modal ---
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const overlay = document.getElementById('modal-overlay');

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', fecharModal);
    }
    if (overlay) {
        overlay.addEventListener('click', fecharModal); // Fecha ao clicar fora
    }
    
    // 1. Listeners para a interatividade do formulário
    if (selectBarbeiro) {
        selectBarbeiro.addEventListener('change', mostrarFotoBarbeiro);
        carregarHorariosDisponiveis(); // Carga inicial
    }
    if (inputData) {
        inputData.addEventListener('change', carregarHorariosDisponiveis);
        // Opcional: Impedir agendamentos para datas passadas (se for um input type="date")
        const hoje = new Date().toISOString().split('T')[0];
        inputData.setAttribute('min', hoje);
    }
    
    // 2. Listener para o ENVIO do Formulário (MODIFICADO)
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', function(event) {
            
            event.preventDefault(); 

            // Coleta os valores de todos os campos
            const nome = document.getElementById('nome').value;
            const barbeiroId = selectBarbeiro ? selectBarbeiro.value : '';
            const barbeiroNome = selectBarbeiro && selectBarbeiro.options[selectBarbeiro.selectedIndex] ? 
                                 selectBarbeiro.options[selectBarbeiro.selectedIndex].textContent : 
                                 '';
            const data = inputData ? inputData.value : '';
            const hora = document.getElementById('hora').value;

            // Validação básica
            if (!nome || !barbeiroId || !data || !hora) {
                // USA O MODAL PARA AVISAR O ERRO
                abrirModal('Por favor, preencha todos os campos do agendamento.');
                return; 
            }

            // Prepara os dados para envio
            const dadosParaEnvio = { 
                nome_cliente: nome, 
                servico: barbeiroNome, // CHAVE CORRETA: O PHP vai ler 'servico'
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
                return response.json(); 
            })
            .then(data => {
                if (data.status === 'success') {
                    console.log("✅ Dados salvos com sucesso no BD:", data);
                } else {
                    console.error('❌ Erro retornado pelo servidor (BD):', data.message);
                }
            })
            .catch(error => {
                console.error('❌ Erro de comunicação com o servidor. Detalhe:', error.message);
            })
            .finally(() => {
                // 4. AÇÃO GARANTIDA: (MODIFICADO)
                
                // Remove o alert() antigo
                // alert(`✅ Agendamento...`);

                // CHAMA O NOVO MODAL com a mensagem dinâmica
                const mensagemConfirmacao = `Agendamento de ${nome} com ${barbeiroNome} confirmado para ${data} às ${hora.substring(0, 5)}!`;
                abrirModal(mensagemConfirmacao);

                // A limpeza do formulário agora acontece na função fecharModal()
            });
        });
    } // Fim do if (formAgendamento)
    
});