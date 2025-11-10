document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const usuarioIdParaCarregar = urlParams.get("id") || 1;

  const nomeElement = document.getElementById("nome_usuario");
  if (nomeElement) nomeElement.textContent = "Carregando...";

  const fetchUrl = `../../../backend/professor/fetch_perfil.php?id=${usuarioIdParaCarregar}`;

  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(
            `Erro HTTP ${response.status}: Falha ao buscar perfil.`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success && data.data) {
        const perfil = data.data;

        if (nomeElement) nomeElement.textContent = perfil.nome;
        document.getElementById("gmail_usuario").textContent = perfil.gmail;
        document.getElementById("telefone_usuario").textContent =
          perfil.telefone;
        document.getElementById("cpf_usuario").textContent = perfil.cpf;
        document.getElementById("data_criacao_usuario").textContent =
          perfil.data_criacao;

        if (perfil.tipo_usuario === "aluno") {
          const planoElement = document.getElementById("plano_aluno");
          if (planoElement)
            planoElement.textContent = perfil.plano.toUpperCase();
        }
      } else {
        if (nomeElement) nomeElement.textContent = `Erro: ${data.message}`;
      }
    })
    .catch((error) => {
      console.error("Erro na requisição (Final):", error);
      if (nomeElement) nomeElement.textContent = `Falha na comunicação.`;
    });
});
