document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-solicitacao');
    const textarea = document.getElementById('texto-solicitacao');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            if (textarea.value.trim() === '') {
                alert('Por favor, escreva sua solicitação antes de enviar.');
            } else {
                alert('Solicitação enviada com sucesso para o professor!');
                textarea.value = '';
            }
        });
    }

});
