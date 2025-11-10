document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-solicitacao');
    const textarea = document.getElementById('texto-solicitacao');
    const btnEnviar = form.querySelector('.btn-enviar'); 

    if (form) {
    
        form.addEventListener('submit', async (e) => { 
            e.preventDefault(); 
            
            const mensagem = textarea.value.trim();

            if (mensagem === '') {
                alert('Por favor, escreva sua solicitação antes de enviar.');
                return; 
            }

  
            const textoBotaoOriginal = btnEnviar.textContent;
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'ENVIANDO...';

            try {
               
                const response = await fetch('../../../backend/alunos/solicitar_mudanca_treino.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mensagem: mensagem }) 
                });

                const resultado = await response.json();

                if (response.ok) {
              
                    alert(resultado.mensagem || 'Solicitação enviada com sucesso!');
                    textarea.value = ''; 
                    
      
                } else {
                
                    alert('Erro: ' + resultado.erro);
                }

            } catch (error) {
        
                console.error('Erro de conexão:', error);
                alert('Erro de conexão. Verifique a rede e tente novamente.');
            } finally {
       
                btnEnviar.disabled = false;
                btnEnviar.textContent = textoBotaoOriginal;
            }
      
        });
    }
});