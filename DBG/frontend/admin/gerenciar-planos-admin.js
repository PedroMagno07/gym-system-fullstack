document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".planos-container");

  async function carregarPlanos() {
    try {
      const resp = await fetch("http://localhost/DBG/backend/admin/listar_planos.php");
      const planos = await resp.json();

      // Renderiza apenas os três planos principais
      container.innerHTML = planos.map(plano => `
        <div class="plano-card" data-id="${plano.plano_id}">
          <div class="plano-header">${plano.nome}</div>

          <div class="plano-valor-container">
            <h3>Valor Atual</h3>
            <p class="valor-atual">R$ ${parseFloat(plano.preco).toFixed(2)}</p>
          </div>

          <h3>Novo Valor</h3>
          <input 
            type="number" 
            class="plano-box preco" 
            placeholder="Digite o novo valor" 
            step="0.01" 
            value="${plano.preco}"
          >

          <h3>Sobre</h3>
          <textarea 
            class="descricao" 
            placeholder="Digite a descrição do plano..."
          >${plano.descricao || ""}</textarea>

          <button class="btn-salvar">
            <i class="fa-solid fa-floppy-disk"></i> Salvar Alterações
          </button>
        </div>
      `).join("");

      // Adiciona evento para o botão de salvar
      document.querySelectorAll(".btn-salvar").forEach(btn => {
        btn.addEventListener("click", async e => {
          const card = e.target.closest(".plano-card");
          const id = card.dataset.id;
          const novoValor = card.querySelector(".preco").value;
          const novaDescricao = card.querySelector(".descricao").value;

          const formData = new FormData();
          formData.append("plano_id", id);
          formData.append("preco", novoValor);
          formData.append("descricao", novaDescricao);

          try {
            const resp = await fetch("http://localhost/DBG/backend/admin/atualizar_plano.php", {
              method: "POST",
              body: formData
            });

            const result = await resp.json();

            if (result.sucesso) {
              card.querySelector(".valor-atual").textContent = `R$ ${parseFloat(novoValor).toFixed(2)}`;
              alert("Plano atualizado com sucesso!");
            } else {
              alert("Erro ao atualizar plano: " + (result.erro || "Desconhecido"));
            }
          } catch (err) {
            console.error("Erro ao enviar atualização:", err);
            alert("Falha ao comunicar com o servidor.");
          }
        });
      });

    } catch (err) {
      console.error("Erro ao carregar planos:", err);
      container.innerHTML = `<p style="color:red;">Erro ao carregar planos.</p>`;
    }
  }

  carregarPlanos();
});
