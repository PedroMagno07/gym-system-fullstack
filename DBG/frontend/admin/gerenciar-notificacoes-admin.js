document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNotificacao");
  const lista = document.getElementById("listaNotificacoes");

  // === Função para carregar as notificações ===
  async function carregarNotificacoes() {
    lista.innerHTML = "<p style='text-align:center;'>Carregando...</p>";

    try {
      const resp = await fetch("http://localhost/DBG/api/listar.php");
      const dados = await resp.json();

      if (!dados.length) {
        lista.innerHTML = "<p style='text-align:center;'>Nenhuma notificação encontrada.</p>";
        return;
      }

      lista.innerHTML = "";

      dados.forEach(n => {
        const item = document.createElement("div");
        item.classList.add("notificacao");
        item.innerHTML = `
          <p>${n.titulo}</p>
          <p>${new Date(n.data_envio).toLocaleDateString("pt-BR")}</p>
          <p>${n.destinatarios}</p>
          <button class="excluir" data-id="${n.notificacao_id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        `;
        lista.appendChild(item);
      });

      // === Lidar com exclusões ===
      document.querySelectorAll(".excluir").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          if (!confirm("Deseja excluir esta notificação?")) return;

          const resp = await fetch("http://localhost/DBG/api/excluir.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });

          const result = await resp.json();
          if (resp.ok) {
            alert(result.mensagem || "Excluída com sucesso!");
            carregarNotificacoes();
          } else {
            alert(result.erro || "Erro ao excluir.");
          }
        });
      });
    } catch (err) {
      lista.innerHTML = "<p style='text-align:center;color:red;'>Erro ao carregar notificações.</p>";
      console.error(err);
    }
  }

  // === Envio do formulário ===
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const dados = {
      titulo: document.getElementById("titulo").value.trim(),
      destinatarios: document.getElementById("destinatarios").value.trim(),
      conteudo: document.getElementById("conteudo").value.trim()
    };

    if (!dados.titulo || !dados.destinatarios || !dados.conteudo) {
      alert("Preencha todos os campos!");
      return;
    }

    const resp = await fetch("http://localhost/DBG/api/criar.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const result = await resp.json();
    if (resp.ok) {
      alert(result.mensagem || "Notificação criada!");
      form.reset();
      carregarNotificacoes();
    } else {
      alert(result.erro || "Erro ao criar notificação.");
    }
  });

  // === Carregar tudo ao abrir ===
  carregarNotificacoes();
});
