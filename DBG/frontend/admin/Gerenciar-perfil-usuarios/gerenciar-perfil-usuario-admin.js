const API_BASE = "http://localhost/DBG1/backend/admin";

async function carregarUsuario() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {
    const resp = await fetch(`${API_BASE}/obter_usuario.php?id=${id}`);
    if (!resp.ok) throw new Error();
    const usuario = await resp.json();

    document.getElementById("nome").value = usuario.nome || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("cpf").value = usuario.cpf || "";
    document.getElementById("tipo_usuario").value = usuario.tipo_usuario || "";
    document.getElementById("plano").value = usuario.plano || "";
    document.getElementById("data_inicio").value = usuario.data_criacao?.split(" ")[0] || "";
  } catch {
    alert("Erro ao carregar dados do usuário.");
  }
}

document.addEventListener("DOMContentLoaded", carregarUsuario);
