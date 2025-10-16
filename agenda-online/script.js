// --- FUNÇÃO DE FOTO DO BARBEIRO (AJUSTADA PARA CHAMAR CARREGAR HORÁRIOS) ---
function mostrarFotoBarbeiro() {
    const selectBarbeiro = document.getElementById('barbeiro');
    const fotoBarbeiro = document.getElementById('barbeiro-foto');
    const mensagemSelecao = document.getElementById('mensagem-selecao');
    const fotoUrl = selectBarbeiro.options[selectBarbeiro.selectedIndex].getAttribute('data-foto');

    if (fotoUrl) {
        fotoBarbeiro.src = fotoUrl;
        fotoBarbeiro.style.display = 'block';
        mensagemSelecao.style.display = 'none';
        
        // Chamada para carregar os horários disponíveis
        carregarHorariosDisponiveis(); 
    } else {
        fotoBarbeiro.style.display = 'none';
        fotoBarbeiro.src = ''; 
        mensagemSelecao.style.display = 'block';
        
        // Limpa os horários se nenhum barbeiro for selecionado
        limparHorarios();
    }
}

// Adiciona os listeners de evento para interatividade
document.addEventListener('DOMContentLoaded', () => {
    // 1. Garante que a foto do barbeiro seja atualizada
    document.getElementById('barbeiro').addEventListener('change', mostrarFotoBarbeiro);
    
    // 2. Garante que os horários sejam recarregados ao mudar a data (para uma possível checagem futura de disponibilidade)
    document.getElementById('data').addEventListener('change', carregarHorariosDisponiveis);
    
    // 3. Carrega os horários iniciais quando a página é carregada
    carregarHorariosDisponiveis();
});


// --- FUNÇÕES DE HORÁRIO ---

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
    
    // Limpa os horários existentes primeiro
    limparHorarios();

    // Configurações de Horário: das 8h às 17h, intervalo de 30 minutos
    const horaInicio = 8;  // 08:00
    const horaFim = 17;    // O último horário agendável será 16:30 (para terminar o corte às 17:00)
    const intervalo = 30; // 30 minutos por agendamento

    // Adiciona a primeira opção "Selecione"
    const optionSelecione = document.createElement('option');
    optionSelecione.value = '';
    optionSelecione.textContent = 'Selecione um Horário';
    selectHora.appendChild(optionSelecione);

    // Loop para gerar os horários
    for (let hora = horaInicio; hora < horaFim; hora++) {
        for (let minuto = 0; minuto < 60; minuto += intervalo) {
            // Se a hora for 17, não queremos agendar mais (pois o expediente termina às 17:00)
            if (hora === horaFim - 1 && minuto >= 60 - intervalo) {
                // Último horário será 16:30
                break; 
            }
            
            // Formata a hora e o minuto com dois dígitos (ex: 08:00, 10:30)
            const horaFormatada = String(hora).padStart(2, '0');
            const minutoFormatado = String(minuto).padStart(2, '0');
            const horario = `${horaFormatada}:${minutoFormatado}`;

            // Cria o elemento <option>
            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario;

            selectHora.appendChild(option);
        }
    }
}


// Certifique-se de que todo o código está dentro de um DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Suas funções de carregarHorariosDisponiveis e mostrarFotoBarbeiro devem estar aqui
    // ... (código existente para foto e horários) ...
    
    // --- NOVO CÓDIGO PARA O BOTÃO SUBMIT ---
    
    // 1. Captura o formulário usando o ID
    const formAgendamento = document.getElementById('form-agendamento');

    // 2. Adiciona um "ouvinte de evento" (listener) para o evento 'submit'
    formAgendamento.addEventListener('submit', function(event) {
        
        // 3. IMPEDE o comportamento padrão de envio do formulário, que recarregaria a página
        event.preventDefault(); 

        // 4. Coleta os valores de todos os campos
        const nome = document.getElementById('nome').value;
        const barbeiroSelect = document.getElementById('barbeiro');
        const barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex].textContent;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;

        // 5. Validação básica (o 'required' do HTML já ajuda, mas essa é uma checagem extra)
        if (!nome || !barbeiroSelect.value || !data || !hora) {
            alert('Por favor, preencha todos os campos do agendamento.');
            return; // Interrompe a função se a validação falhar
        }

        // 6. Simulação do Processamento ou Envio dos Dados
        
        console.log("--- Agendamento Realizado ---");
        console.log(`Cliente: ${nome}`);
        console.log(`Barbeiro: ${barbeiroNome}`);
        console.log(`Data: ${data}`);
        console.log(`Hora: ${hora}`);

        // EM UM PROJETO REAL, VOCÊ FARIA ISSO:
        /*
        fetch('/api/agendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, barbeiroId: barbeiroSelect.value, data, hora })
        })
        .then(response => response.json())
        .then(data => {
            // Se o servidor retornar sucesso
            alert(`✅ Agendamento de ${nome} com ${barbeiroNome} confirmado para ${data} às ${hora}!`);
            formAgendamento.reset(); // Limpa o formulário após o sucesso
        })
        .catch(error => {
            // Se houver um erro de rede ou do servidor
            alert('❌ Erro ao agendar. Tente novamente mais tarde.');
            console.error('Erro de envio:', error);
        });
        */
        
        // --- PARA ESTE EXERCÍCIO (SEM SERVIDOR) ---
        // Apenas exibe uma mensagem de sucesso no navegador:
        alert(`✅ Agendamento de ${nome} com ${barbeiroNome} confirmado para ${data} às ${hora}!\n\n(Verifique o console para os detalhes)`);
        
        // Opcional: Limpa o formulário após o agendamento
        formAgendamento.reset();
        
        // Opcional: Chama a função para garantir que a foto e horários voltem ao estado inicial
        mostrarFotoBarbeiro();
        carregarHorariosDisponiveis();
    });
    
    // (O restante do código de inicialização do DOMContentLoaded)
});