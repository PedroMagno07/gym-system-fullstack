const API_BASE = "http://localhost/DBG1/backend/admin";

async function listarNotificacoes() {
  const lista = document.getElementById("listaNotificacoes");
  lista.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE}/listar_notificacoes.php`);
    if (!response.ok) throw new Error("Erro ao buscar notificações");

    const notificacoes = await response.json();
    if (!notificacoes.length) {
      lista.innerHTML = `<p style="color:red;">Nenhuma notificação encontrada.</p>`;
      return;
    }

    notificacoes.forEach(n => {
      const item = document.createElement("div");
      item.classList.add("notificacao-item");

      item.innerHTML = `
        <p>${n.titulo}<br><small>${n.data_envio}</small></p>
        <p>${n.data_envio}</p>
        <p>${n.destinatarios}</p>
        <button class="excluir" data-id="${n.notificacao_id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      item.querySelector(".excluir").addEventListener("click", async () => {
        if (!confirm("Deseja realmente excluir esta notificação?")) return;
        await fetch(`${API_BASE}/excluir_notificacao.php?id=${n.notificacao_id}`, { method: "DELETE" });
        listarNotificacoes();
      });

      lista.appendChild(item);
    });
  } catch (error) {
    lista.innerHTML = `<p style="color:red;">Erro ao carregar notificações.</p>`;
  }
}

async function criarNotificacao() {
  const titulo = document.getElementById("titulo").value;
  const destinatarios = document.getElementById("destinatarios").value;
  const conteudo = document.getElementById("conteudo").value;

  const payload = { titulo, destinatarios, conteudo };
  const resp = await fetch(`${API_BASE}/criar_notificacao.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (resp.ok) {
    alert("Notificação criada!");
    listarNotificacoes();
    document.getElementById("formNotificacao").reset();
  } else {
    alert("Erro ao criar notificação.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  listarNotificacoes();
  document.getElementById("formNotificacao").addEventListener("submit", e => {
    e.preventDefault();
    criarNotificacao();
  });
});
