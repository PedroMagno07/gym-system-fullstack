const API_BASE = "http://localhost/DBG1/backend/admin";

async function carregarUsuarios() {
  try {
    const resp = await fetch(`${API_BASE}/listar_usuarios.php`);
    if (!resp.ok) throw new Error();
    const usuarios = await resp.json();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    usuarios.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.nome}</td>
        <td>${u.email}</td>
        <td>${u.tipo_usuario}</td>
        <td>
          <button class="editar" data-id="${u.usuario_id}">Editar</button>
          <button class="deletar" data-id="${u.usuario_id}">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch {
    document.querySelector("tbody").innerHTML = `<tr><td colspan="4">Erro ao carregar usuários.</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", carregarUsuarios);
