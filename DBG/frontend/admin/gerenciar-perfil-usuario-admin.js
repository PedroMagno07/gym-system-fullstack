document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ID do usuário não informado.");
    return;
  }

    const avatar = document.getElementById("avatar");
    const inputFoto = document.getElementById("foto");

  try {
    // Requisição ao backend
    const resp = await fetch(`http://localhost/DBG/api/obter_usuario.php?id=${id}`);
    const text = await resp.text();
    console.log("Resposta bruta do PHP:", text);

    let usuario;
    try {
      usuario = JSON.parse(text);
    } catch (jsonErr) {
      console.error("Erro ao converter JSON:", jsonErr);
      alert("Erro ao carregar dados do usuário. Veja o console para detalhes.");
      return;
    }

    if (usuario.erro) {
      alert("Erro: " + usuario.erro);
      return;
    }

    console.log("Usuário carregado:", usuario);

    // Preenche os campos
    document.getElementById("username").textContent = usuario.nome || "Usuário";
    document.getElementById("nome").value = usuario.nome || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("cpf").value = usuario.cpf || "";
    document.getElementById("tipo_usuario").value = usuario.tipo_usuario || "";
    document.getElementById("plano").value = usuario.plano || "";
    document.getElementById("data_inicio").value =
      usuario.data_criacao?.split(" ")[0] || "";

    // Exibe a foto (ou padrão)
    const fotoURL = usuario.foto_perfil
      ? `http://localhost/DBG/${usuario.foto_perfil}`
      : "http://localhost/DBG/frontend/admin/default-avatar.png";

    avatar.style.backgroundImage = `url('${fotoURL}')`;

    // Upload de nova imagem
    avatar.addEventListener("click", () => inputFoto.click());

    inputFoto.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("usuario_id", id);
      formData.append("foto", file);

      try {
        const uploadResp = await fetch("http://localhost/DBG/api/atualizar_usuario.php", {
          method: "POST",
          body: formData,
        });

        const resultado = await uploadResp.json();
        console.log("Resultado upload:", resultado);

        if (resultado.sucesso) {
          avatar.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
          alert("Foto atualizada com sucesso!");
        } else {
          alert("Erro ao atualizar foto.");
        }
      } catch (uploadErr) {
        console.error("Erro ao enviar imagem:", uploadErr);
        alert("Falha ao enviar imagem.");
      }
    });
  } catch (e) {
    console.error("Erro inesperado:", e);
    alert("Erro ao buscar dados do usuário.");
  }
});
