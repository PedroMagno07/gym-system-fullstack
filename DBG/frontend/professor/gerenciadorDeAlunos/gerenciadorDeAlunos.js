document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("alunos_container");

  const fetchUrl = "../../../backend/professor/fetch_alunos.php";
  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status} ao buscar dados.`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success && data.data.length > 0) {
        container.innerHTML = "";

        data.data.forEach((aluno) => {
          const cardHTML = `
    <div class="card-aluno">
        <div class="card-inner-content">
            <div class="top-info">
                <div class="ellipse-11"></div> 
                <div class="text-info">
                    <p class="nome-aluno">NOME: ${aluno.nome}</p>
                    <p class="email-aluno" style="font-size: 14px; margin-top: -5px;">${
                      aluno.email
                    }</p> 
                </div>
            </div>
            
            <div class="plano-info-row">
                <p class="plano-label">PLANO:</p>
                <p class="plano-aluno">${aluno.nome_plano.toUpperCase()}</p>
            </div>
            
            <div class="links-container">
               <a href="../perfilDoAluno/perfil.html?id=${
                 aluno.usuario_id
               }" class="perfil-button">PERFIL</a>


                <a href="#" class="treino-button">TREINO</a>
            </div>
        </div>
    </div>
`;

          container.insertAdjacentHTML("beforeend", cardHTML);
        });
      } else {
        container.innerHTML =
          '<p style="text-align: center;">Nenhum aluno cadastrado no momento.</p>';
      }
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
      container.innerHTML = `<p style="text-align: center; color: red;">Falha ao carregar a lista de alunos: ${error.message}</p>`;
    });
});
