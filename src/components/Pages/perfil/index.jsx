import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function PerfilProfessor() {

  const navigate = useNavigate();

  const [popupSucesso, setPopupSucesso] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // regex validação senha
  const validarSenha = (senha) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
    return regex.test(senha);
  };

  // buscar perfil
  useEffect(() => {
    const usuarioId = localStorage.getItem("idUsuario");
    const token = localStorage.getItem("token");
  
    if (!usuarioId) {
      console.error("ID do usuário não encontrado");
      return;
    }
    fetch(`${backendURL}/api/Aluno/perfil/${usuarioId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar perfil");
      }
      return response.json();
    })
    .then((data) => {
      setNome(data.nome);
      setEmail(data.email);
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
  }, []);

  // atualizar senha
  const atualizarSenha = async () => {

    const idUsuario = localStorage.getItem("idUsuario");
    const token = localStorage.getItem("token");

    if (!idUsuario) {
      alert("Usuário não encontrado");
      return;
    }

    if (!validarSenha(novaSenha)) {
      alert(
        "A senha deve ter no mínimo 8 caracteres, incluindo: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial."
      );
      return;
    }

    try {
      const response = await fetch(
        `${backendURL}/api/Usuario/atualizarSenha/${idUsuario}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            novaSenha: novaSenha,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao atualizar senha");
      }
      setPopupSucesso(true);
      setTimeout(() => setPopupSucesso(false), 3000);
      setNovaSenha("");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar senha");
    }
  };

  return (
    <div className="perfil-page">

      <aside className="perfil-sidebar">
        <div className="sidebar-perfil" onClick={() => navigate("/professores")}>
          <div className="avatar-sidebar"><FaArrowLeft /></div>
        </div>
      </aside>

      <div className="perfil-content">
        <div className="mobile-back-button" onClick={() => navigate("/professores")}>
          <FaArrowLeft />
        </div>

        <header className="perfil-header">

          <div className="header-mobile">
            <FaArrowLeft className="mobile-back" onClick={() => navigate("/professores")}/>
          </div>

          <div className="header-left">
            <div>
              <h2>Perfil</h2>
              <span className="sub">Professor</span>
            </div>
          </div>

          <span className="student-tag" onClick={() => navigate("/professores")}>
            STUDENT <span>+</span>
          </span>

        </header>
        <div className="mobile-back-button" onClick={() => navigate("/professores")}>
          <FaArrowLeft />
        </div>

        <div className="perfil-card">
          <div className="foto-section">
            <div className="foto-box">
              <img src="https://picsum.photos/200" alt="Foto de perfil" className="perfil-img"/>
            </div>

            <button className="upload-btn">
              <FaUpload />
              Fazer upload de nova foto
            </button>
          </div>
          <div className="form-section">
            <div className="input-group">
              <label>Nome</label>
              <input type="text" value={nome} readOnly />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" value={email} readOnly />
            </div>

            <div className="input-group">
              <label>Nova senha</label>
              <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)}placeholder="Digite a nova senha"/>
            </div>
            <button className="atualizar-senha" onClick={atualizarSenha}>
              Atualizar Senha
            </button>
          </div>
        </div>
      </div>
      {popupSucesso && (
        <div className="toast-sucesso">
          Senha atualizada com sucesso!
        </div>
      )}
    </div>
  );
}