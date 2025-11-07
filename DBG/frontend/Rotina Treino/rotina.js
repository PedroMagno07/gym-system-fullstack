document.addEventListener('DOMContentLoaded', () => {
    
  localStorage.removeItem('diasConcluidos');

  const tabs = document.querySelectorAll('.treino-tabs li');
  const tabContents = document.querySelectorAll('.treino-dia');

  const allCheckboxes = document.querySelectorAll('.exercicio-check');
  const diarioBar = document.getElementById('progresso-diario-barra');
  const diarioTexto = document.getElementById('progresso-diario-texto');

  const finalizarBtn = document.getElementById('btn-finalizar');
  const notasInput = document.getElementById('notas-input');
  const semanalBar = document.getElementById('progresso-semanal-barra');
  const semanalTexto = document.getElementById('progresso-semanal-texto');

  let diasConcluidos = JSON.parse(localStorage.getItem('diasConcluidos')) || {
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(item => item.classList.remove('tab-active'));
      tab.classList.add('tab-active');

      tabContents.forEach(content => {
        content.classList.remove('tab-content-active');
      });

      const day = tab.getAttribute('data-day');
      const activeContent = document.getElementById(day);
      activeContent.classList.add('tab-content-active');
      atualizarProgressoDiario();
    });
  });

  allCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      atualizarProgressoDiario();
    });
  });

  function atualizarProgressoDiario() {
    const diaAtivo = document.querySelector('.treino-dia.tab-content-active');
    if (!diaAtivo) return; 

    const checkboxesDoDia = diaAtivo.querySelectorAll('.exercicio-check');
    const totalExercicios = checkboxesDoDia.length;
    
    const exerciciosConcluidos = diaAtivo.querySelectorAll('.exercicio-check:checked').length;

    const porcentagem = totalExercicios > 0 ? (exerciciosConcluidos / totalExercicios) * 100 : 0;

    if (diarioBar) {
        diarioBar.style.width = `${porcentagem}%`;
    }
    if (diarioTexto) {
        diarioTexto.textContent = `${Math.round(porcentagem)}%`;
    }
  }

  if (finalizarBtn) {
    finalizarBtn.addEventListener('click', () => {
      const diaAtivoEl = document.querySelector('.treino-dia.tab-content-active');
      const diaAtivoKey = diaAtivoEl.id; 

      if (diasConcluidos[diaAtivoKey]) {
        alert('Este treino já foi finalizado.');
        return;
      }

      const progressoDiarioAtual = diarioBar ? diarioBar.style.width : '0%';
      if (progressoDiarioAtual !== '100%') {
        alert('Você precisa marcar todos os exercícios como concluídos para finalizar o treino.');
        return;
      }
      
      if (notasInput && notasInput.value.trim() === '') {
        alert('Por favor, preencha suas notas sobre o treino antes de finalizar.');
        return;
      }

      alert(`Treino de ${diaAtivoKey.charAt(0).toUpperCase() + diaAtivoKey.slice(1)} finalizado com sucesso!`);
      
      diasConcluidos[diaAtivoKey] = true;
      localStorage.setItem('diasConcluidos', JSON.stringify(diasConcluidos));
      
      if(notasInput) notasInput.value = '';
      diaAtivoEl.querySelectorAll('.exercicio-check').forEach(cb => {
        cb.disabled = true;
      });

      atualizarProgressoSemanal();
    });
  }

  function atualizarProgressoSemanal() {
    const diasFinalizados = Object.values(diasConcluidos).filter(status => status === true).length;
    const totalDias = Object.keys(diasConcluidos).length; // 5

    const porcentagem = (diasFinalizados / totalDias) * 100;

    if (semanalBar) {
        semanalBar.style.width = `${porcentagem}%`;
    }
    if (semanalTexto) {
        semanalTexto.textContent = `${Math.round(porcentagem)}%`;
    }
  }

  atualizarProgressoDiario();
  atualizarProgressoSemanal();

  Object.keys(diasConcluidos).forEach(diaKey => {
    if (diasConcluidos[diaKey] && document.getElementById(diaKey)) {
      document.getElementById(diaKey).querySelectorAll('.exercicio-check').forEach(cb => {
        cb.disabled = true;
      });
    }
  });
});