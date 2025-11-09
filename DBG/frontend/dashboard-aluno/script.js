/// --- CLASSE ORIGINAL DA NAVBAR (Mantida) ---
class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";
    this.handleClick = this.handleClick.bind(this);
  }

  animateLinks() {
    this.navLinks.forEach((link, index) => {
      link.style.animation
        ? (link.style.animation = "")
        : (link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`);
    });
  }

  handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
    this.animateLinks();
  }

  addClickEvent() {
    if (this.mobileMenu) {
      this.mobileMenu.addEventListener("click", this.handleClick);
    }
  }

  init() {
    this.addClickEvent();
    return this;
  }
}

// Inicializa a Navbar Original
const mobileNavbar = new MobileNavbar(
  ".mobile-menu",
  ".nav-list",
  ".nav-list li"
);
mobileNavbar.init();


// --- LÓGICA de NOTIFICAÇÕES (Adicionada) ---

// Função original mantida, mas agora também marca como lida
function toggleCard(element) {
    element.classList.toggle('expanded');
    
    // Pega o <li> pai
    const item = element.closest('.notification-item');
    
    // Se tiver a classe 'unread', chama a API para marcar como lida
    if (item && item.classList.contains('unread')) {
        const id = element.dataset.id; // Pega o ID que adicionamos ao card
        marcarComoLida(id, item);
    }
}

// Função para marcar como lida (chama a API)
async function marcarComoLida(id, itemElement) {
    // Remove o status visual imediatamente
    itemElement.classList.remove('unread');
    
    try {
        await fetch('marcar_lida.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        // Não precisa fazer nada com a resposta,
        // a menos que queira tratar um erro
    } catch (error) {
        console.error("Erro ao marcar notificação como lida:", error);
        // Se der erro, readiciona a classe (opcional)
        itemElement.classList.add('unread'); 
    }
}

// Função para formatar datas (HOJE, ONTEM, 05/11)
function formatarDataRelativa(dataSQL) {
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);
    
    const dataNotif = new Date(dataSQL);

    // Zera horas para comparar apenas datas
    hoje.setHours(0, 0, 0, 0);
    ontem.setHours(0, 0, 0, 0);
    dataNotif.setHours(0, 0, 0, 0);

    if (hoje.getTime() === dataNotif.getTime()) {
        return "HOJE";
    }
    if (ontem.getTime() === dataNotif.getTime()) {
        return "ONTEM";
    }
    
    // Formato DD/MM
    return dataNotif.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });
}

// Função principal para carregar as notificações
async function carregarNotificacoes() {
    const lista = document.querySelector('.notifications-list');
    if (!lista) return;

    try {
        const response = await fetch('../../backend/API/obter_minhas_notificacoes.php');
        
        if (response.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = '/login.html'; // Ajuste para sua página de login
            return;
        }
        
        const notificacoes = await response.json();
        
        // Limpa a lista estática
        lista.innerHTML = ''; 

        if (notificacoes.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #555; margin-top: 30px;">Nenhuma notificação encontrada.</p>';
            return;
        }
        
        let dataAnterior = ""; // Controla os divisores de data

        notificacoes.forEach(notif => {
            const dataFormatada = formatarDataRelativa(notif.data_envio);
            
            // 1. Adiciona o divisor de data se for diferente do anterior
            if (dataFormatada !== dataAnterior) {
                const divisor = document.createElement('div');
                divisor.className = 'date-divider';
                divisor.textContent = dataFormatada;
                lista.appendChild(divisor);
                dataAnterior = dataFormatada;
            }

            // 2. Cria o item (li)
            const li = document.createElement('li');
            li.className = 'notification-item';
            if (notif.lida == 0) {
                li.classList.add('unread');
            }

            // Formata a hora (HH:MM)
            const hora = new Date(notif.data_envio).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            // 3. Cria o conteúdo interno (baseado no seu HTML)
            // O ícone do sino está fixo, mas você pode mudar isso
            li.innerHTML = `
                <div class="status-indicator"></div>
                <div class="notification-card" 
                     onclick="toggleCard(this)" 
                     data-id="${notif.notificacao_id}">
                    
                    <div class="notification-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#0E1111"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
                    </div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <h3>${notif.titulo}</h3>
                            <span class="time-badge">${hora}</span>
                        </div>
                        <p>${notif.conteudo}</p>
                    </div>
                </div>
            `;
            
            lista.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao carregar notificações:", error);
        lista.innerHTML = '<p style="text-align: center; color: red; margin-top: 30px;">Erro ao carregar notificações.</p>';
    }
}

// Inicia o carregamento ao carregar a página
document.addEventListener('DOMContentLoaded', carregarNotificacoes);