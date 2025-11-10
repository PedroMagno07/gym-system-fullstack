document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);

  const usuarioIdParaCarregar = urlParams.get("id") || 1;

  // Elementos de carregamento/erro comuns
  const nomeElement = document.getElementById("nome_usuario");
  nomeElement.textContent = "Carregando...";

  const fetchUrl = `../../../backend/fetch_perfil.php?id=${usuarioIdParaCarregar}`;

  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(git 
            `Erro HTTP ${response.status}: ${text || "Resposta vazia."}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success && data.data) {
        const perfil = data.data;
        const tipoUsuario = data.tipo_usuario;

        nomeElement.textContent = perfil.nome;
        document.getElementById("gmail_usuario").textContent = perfil.gmail;
        document.getElementById("telefone_usuario").textContent =
          perfil.telefone;
        document.getElementById("cpf_usuario").textContent = perfil.cpf;
        document.getElementById("data_criacao_usuario").textContent =
          perfil.data_criacao;

        if (tipoUsuario === "aluno") {
          document.getElementById("plano_aluno").textContent =
            perfil.plano.toUpperCase();
        } else if (tipoUsuario === "professor") {
          document.getElementById("cref_professor").textContent = perfil.cref;
          document.getElementById("data_contratacao_professor").textContent =
            perfil.data_contratacao;
        } else {
          console.warn(
            `Tipo de usuário '${tipoUsuario}' carregado com sucesso, mas sem renderização específica.`
          );
        }
      } else {
      }
    })
    .catch((error) => {});
});
