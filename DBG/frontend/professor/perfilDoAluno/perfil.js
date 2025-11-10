document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const alunoIdParaCarregar = urlParams.get("id") || 1;

  const planoElement = document.getElementById("plano_aluno");
  const nomeElement = document.getElementById("nome_aluno");

  nomeElement.textContent = "Carregando...";
  planoElement.textContent = "Carregando...";

  const fetchUrl = `../../../backend/professor/fetch_perfilAluno.php?id=${alunoIdParaCarregar}`;

  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(
            `Erro HTTP ${response.status}: ${text || "Resposta vazia."}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success && data.data) {
        const perfil = data.data;

        nomeElement.textContent = perfil.nome;
        document.getElementById("gmail_aluno").textContent = perfil.gmail;
        document.getElementById("telefone_aluno").textContent = perfil.telefone;
        document.getElementById("cpf_aluno").textContent = perfil.cpf;
        document.getElementById("data_criacao_aluno").textContent =
          perfil.data_criacao;

        planoElement.textContent = perfil.plano.toUpperCase();
      } else {
        console.error("Erro do servidor (Lógica):", data.message);
        nomeElement.textContent = `Erro: ${data.message}`;
      }
    })
    .catch((error) => {
      console.error("Erro na requisição (Final):", error);
      nomeElement.textContent = `Falha na comunicação: ${error.message}`;
      planoElement.textContent = "ERRO";
    });
});
