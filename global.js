// Script adicional para funcionalidades do agendamento
document.addEventListener('DOMContentLoaded', function() {
    // Validação de data mínima
    const dataInput = document.getElementById('data');
    if (dataInput) {
        const hoje = new Date().toISOString().split('T')[0];
        dataInput.setAttribute('min', hoje);
    }

    // Validação de CRM
    function validarCRM(crm) {
        // Formato básico: números e letras, mínimo 4 caracteres
        return /^[A-Za-z0-9]{4,}$/.test(crm);
    }

    // Validação de nome do médico
    function validarNomeMedico(nome) {
        return nome.length >= 3 && /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
    }

    // Notificações
    function mostrarNotificacao(mensagem, tipo = 'sucesso') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao ${tipo}`;
        notificacao.innerHTML = `
            <div class="notificacao-conteudo">
                <i class="fas fa-${tipo === 'sucesso' ? 'check' : 'exclamation-triangle'}"></i>
                <span>${mensagem}</span>
            </div>
        `;

        // Estilos da notificação
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'sucesso' ? 'var(--sucesso)' : 'var(--erro)'};
            color: white;
            padding: var(--espaco-md);
            border-radius: var(--borda-radius);
            box-shadow: var(--sombra-forte);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notificacao);

        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Exportar funções para uso global
    window.agendamentoUtils = {
        validarCRM,
        validarNomeMedico,
        mostrarNotificacao
    };
});

// Função para exportar histórico (opcional)
function exportarHistorico() {
    const consultas = JSON.parse(localStorage.getItem('consultas_masculife') || '[]');
    const historico = consultas.filter(c => c.status !== 'agendada');
    
    if (historico.length === 0) {
        alert('Nenhum histórico disponível para exportar.');
        return;
    }

    const csv = [
        ['Médico', 'CRM', 'Especialidade', 'Data', 'Horário', 'Status', 'Data do Agendamento'],
        ...historico.map(consulta => [
            consulta.nomeMedico,
            consulta.crm,
            consulta.especialidade,
            new Date(consulta.data).toLocaleDateString('pt-BR'),
            consulta.horario,
            consulta.status,
            new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico-consultas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}