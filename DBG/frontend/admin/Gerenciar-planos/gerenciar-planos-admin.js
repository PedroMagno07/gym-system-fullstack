const API_BASE = "http://localhost/DBG1/backend/admin";

async function carregarPlanos() {
  try {
    const response = await fetch(`${API_BASE}/listar_planos.php`);
    if (!response.ok) throw new Error("Erro ao buscar planos");
    const planos = await response.json();

    // Procura tanto .planos-container quanto .cards-container
    const container =
      document.querySelector(".planos-container") ||
      document.querySelector(".cards-container");
    if (!container) return;

    container.innerHTML = "";

    planos
      // garanta só os três planos desejados (opcional, se o backend traz mais)
      .filter(p => ["Júnior", "Pleno", "Senior", "Sênior"].includes(p.nome))
      .forEach(plano => {
        const card = document.createElement("div");
        card.classList.add("plano-card");

        card.innerHTML = `
          <div class="plano-header">${plano.nome}</div>

          <div class="plano-valor-container">
            <div class="valor-atual">R$ ${parseFloat(plano.preco).toFixed(2)}</div>
            <input type="number" class="plano-box novo-valor" placeholder="Novo valor" step="0.01">
          </div>

          <textarea class="descricao">${plano.descricao || ""}</textarea>

          <button class="btn-salvar" data-id="${plano.plano_id}">
            <i class="fa-solid fa-save"></i> Salvar Alterações
          </button>
        `;

        card.querySelector(".btn-salvar").addEventListener("click", async () => {
          const novoValor = card.querySelector(".novo-valor").value;
          const novaDescricao = card.querySelector(".descricao").value;

          const formData = new FormData();
          formData.append("id", plano.plano_id);
          formData.append("preco", novoValor);
          formData.append("descricao", novaDescricao);

          const resp = await fetch(`${API_BASE}/atualizar_plano.php`, {
            method: "POST",
            body: formData
          });

          if (!resp.ok) {
            alert("Erro ao atualizar plano");
          } else {
            alert("Plano atualizado com sucesso");
            // Atualiza o preço exibido sem recarregar:
            const valorAtualEl = card.querySelector(".valor-atual");
            if (novoValor) valorAtualEl.textContent = `R$ ${parseFloat(novoValor).toFixed(2)}`;
          }
        });

        container.appendChild(card);
      });
  } catch (error) {
    const container =
      document.querySelector(".planos-container") ||
      document.querySelector(".cards-container");
    if (container) {
      container.innerHTML = `<p class="erro">Erro ao carregar planos.</p>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", carregarPlanos);
