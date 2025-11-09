const botaoFinalizar = document.getElementById('btn-finalizar');
const botaoSalvar = document.getElementById('btn-salvar-anotacao');
const modal = document.getElementById('modal-anotacao');

const checkboxesTreino = document.querySelectorAll('.card-exercicio input[type="checkbox"]');
const progressoDiaBarra = document.getElementById('progresso-dia');
const progressoDiaTexto = document.getElementById('porcentagem-dia');

const progressoSemanaBarra = document.getElementById('progresso-semana');
const progressoSemanaTexto = document.getElementById('porcentagem-semana');

const TOTAL_TREINOS_SEMANA = 5;

function atualizarProgressoDiario() {
    const totalExercicios = checkboxesTreino.length;
    if (totalExercicios === 0) return; 

    const exerciciosFeitos = document.querySelectorAll('.card-exercicio input[type="checkbox"]:checked').length;
    const porcentagem = Math.round((exerciciosFeitos / totalExercicios) * 100);

    progressoDiaBarra.value = porcentagem;
    progressoDiaTexto.textContent = porcentagem + '%';
}

checkboxesTreino.forEach(function(checkbox) {
    checkbox.addEventListener('change', atualizarProgressoDiario);
});

botaoFinalizar.addEventListener('click', function() {
    modal.style.display = 'block';
});

botaoSalvar.addEventListener('click', function() {
    modal.style.display = 'none';

    salvarTreinoDeHoje();
    
    atualizarProgressoSemanal();
});

function salvarTreinoDeHoje() {
    const hojeString = new Date().toLocaleDateString('pt-BR');
    
    localStorage.setItem(hojeString, 'concluido');
    console.log('Treino salvo para a data: ' + hojeString);
}

function atualizarProgressoSemanal() {
    const treinosFeitosEstaSemana = contarTreinosNaSemana();
    
    const porcentagem = Math.round((treinosFeitosEstaSemana / TOTAL_TREINOS_SEMANA) * 100);

    progressoSemanaBarra.value = porcentagem;
    progressoSemanaTexto.textContent = porcentagem + '%';
}

function contarTreinosNaSemana() {
    let treinosContados = 0;
    const hoje = new Date();
    
    const diaDaSemana = hoje.getDay(); 
    const diasParaVoltar = (diaDaSemana === 0) ? 6 : diaDaSemana - 1;
    const inicioDaSemana = new Date(hoje.setDate(hoje.getDate() - diasParaVoltar));

    let datasVerificadas = {}; 

    for (let i = 0; i < 7; i++) {
        let diaChecado = new Date(inicioDaSemana);
        diaChecado.setDate(diaChecado.getDate() + i);
        
        let dataString = diaChecado.toLocaleDateString('pt-BR');
        
        if (!datasVerificadas[dataString] && localStorage.getItem(dataString) === 'concluido') {
            treinosContados++;
            datasVerificadas[dataString] = true; 
        }
    }
    
    console.log("Treinos encontrados nesta semana: " + treinosContados);
    return treinosContados;
}

atualizarProgressoDiario();
atualizarProgressoSemanal();