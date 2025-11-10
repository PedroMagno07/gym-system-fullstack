document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-solicitacao');
    const textarea = document.getElementById('texto-solicitacao');

    form.addEventListener('submit', (event) => {

        event.preventDefault();

        const mensagem = textarea.value;

        if (mensagem.trim() === '') {
            alert('Por favor, escreva sua solicitação antes de enviar.');
            return; 
        }
        
        console.log('--- DADOS PRONTOS PARA ENVIAR AO BACK-END ---');
        console.log('Mensagem:', mensagem);

        const idDoAluno = 1; 
        console.log('ID do Aluno (simulado):', idDoAluno);
        
        console.log('-------------------------------------------');

        alert('Solicitação enviada com sucesso! (Simulação do Front-end)');
        textarea.value = ''; 
    });
});