document.addEventListener('DOMContentLoaded', () => {
    
    const todosOsItens = document.querySelectorAll('.solicitacao-item');
    const tituloModal = document.getElementById('modal-titulo');

    todosOsItens.forEach(item => {
        item.addEventListener('click', () => {
            todosOsItens.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const nomeAluno = item.querySelector('span').textContent;
            if (tituloModal) {
                tituloModal.textContent = `Responder para ${nomeAluno}`;
            }
        });
    });

    const btnVerEditar = document.querySelector('.btn-ver-treino');
    const btnRecusar = document.querySelector('.btn-recusar');

    if (btnVerEditar) {
        btnVerEditar.addEventListener('click', () => {
            alert('FUNCIONALIDADE: Aqui abriria a página de edição de treino deste aluno.');
        });
    }

    if (btnRecusar) {
        btnRecusar.addEventListener('click', () => {
            const confirmar = confirm('Tem certeza que deseja recusar esta solicitação?');
            
            if (confirmar) {
                alert('Solicitação recusada. O aluno será notificado (função do backend).');
                const itemAtivo = document.querySelector('.solicitacao-item.active');
                if (itemAtivo) {
                    itemAtivo.remove();
                }
            }
        });
    }

    const modal = document.getElementById('modal-resposta');
    const btnAbrirModal = document.getElementById('btn-abrir-modal-resposta');
    const btnCancelar = document.getElementById('btn-cancelar-resposta');
    const btnEnviarResposta = document.getElementById('btn-enviar-resposta');

    if (btnAbrirModal && modal) {
        btnAbrirModal.addEventListener('click', () => {
            const itemAtivo = document.querySelector('.solicitacao-item.active span');
            const nomeAluno = itemAtivo ? itemAtivo.textContent : 'o Aluno';
            
            if (tituloModal) {
                tituloModal.textContent = `Responder para ${nomeAluno}`;
            }
            
            modal.style.display = 'flex';
        });
    }

    if (btnCancelar && modal) {
        btnCancelar.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    if (btnEnviarResposta && modal) {
        btnEnviarResposta.addEventListener('click', () => {
            const texto = document.getElementById('texto-resposta');
            if (texto.value.trim() === '') {
                alert('Por favor, escreva uma resposta.');
            } else {
                alert('Resposta enviada ao aluno! (Função do backend)');
                modal.style.display = 'none';
                texto.value = '';
            }
        });
    }

    const btnVoltar = document.querySelector('.btn-voltar');

    if (btnVoltar) {
        btnVoltar.addEventListener('click', (e) => {
            e.preventDefault(); 
            alert('Este botão deveria voltar para o dashboard do Professor.');
        });
    }

});
