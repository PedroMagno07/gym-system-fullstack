document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.querySelector(".user-table");
  const search = document.querySelector(".search-box input");

  // Função principal: carrega e renderiza usuários
  async function carregarUsuarios(filtro = "") {
    try {
      const resp = await fetch(
        "http://localhost/DBG/backend/admin/listar_usuarios.php"
      );
      const dados = await resp.json();

      console.log("Usuários recebidos:", dados);

      // Filtro por nome
      const filtrados = dados.filter((u) =>
        u.nome.toLowerCase().includes(filtro.toLowerCase())
      );

      // Monta os cards dinamicamente
      lista.innerHTML = filtrados
        .map(
          (u) => `
        <div class="user-card" data-id="${u.usuario_id}">
          <div class="avatar" style="background-image:url('http://localhost/DBG/${
            u.foto_perfil ?? "frontend/admin/default-avatar.png"
          }')"></div>
          <div class="user-info">
            <h2>${u.nome}</h2>
            <p>${u.email}</p>
          </div>
          <div class="user-type">${u.tipo_usuario}</div>
          <div class="user-plan">${u.plano ?? "—"}</div>
          <div class="user-config"><i class="fa-solid fa-user-gear"></i></div>
        </div>
      `
        )
        .join("");

      // Adiciona evento de clique em cada engrenagem
      document.querySelectorAll(".user-card .user-config").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.closest(".user-card").dataset.id;
          console.log("Usuário selecionado:", id);
          // Redireciona para a página de perfil com o ID do usuário
          window.location.href = `gerenciar-perfil-usuario-admin.html?id=${id}`;
        });
      });
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      lista.innerHTML = `<p style="color:red;">Erro ao carregar usuários.</p>`;
    }
  }

  // Busca dinâmica
  search.addEventListener("input", (e) => carregarUsuarios(e.target.value));

  // Carrega lista inicial
  carregarUsuarios();
});
