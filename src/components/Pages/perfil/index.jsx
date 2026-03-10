import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";


export default function PerfilProfessor() {
  const navigate = useNavigate();
  const [popupSucesso, setPopupSucesso] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const atualizarSenha = async () => {
    const idUsuario = localStorage.getItem("idUsuario");
    const token = localStorage.getItem("token");
  
    console.log("ID USUARIO:", idUsuario);
    console.log("TOKEN:", token);
  
    if (!idUsuario) {
      alert("Usuário não encontrado");
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
            novaSenha: senha,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Erro ao atualizar senha");
      }
  
      setPopupSucesso(true);
      setTimeout(() => setPopupSucesso(false), 3000);

      setSenha("");
  
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar senha");
    }
  };
  return (
    <div className="perfil-page">
      <aside className="perfil-sidebar">
        <div
          className="sidebar-perfil"
          onClick={() => navigate("/professores")}
        >
          <div className="avatar-sidebar">
            <FaArrowLeft />
          </div>
        </div>
      </aside>
      <div className="perfil-content">

        <header className="perfil-header">
          <div className="header-left">

            <div>
              <h2>Perfil</h2>
              <span className="sub">Professor</span>
            </div>
          </div>

          <span
            className="student-tag"
            onClick={() => navigate("/professores")}
          >
            STUDENT <span>+</span>
          </span>
        </header>

        <div className="perfil-card">
          <div className="foto-section">
            <div className="foto-box">
              <img
                src="https://picsum.photos/200"
                alt="Foto de perfil"
                className="perfil-img"
              />
            </div>

            <button className="upload-btn">
              <FaUpload />
              Fazer upload de nova foto
            </button>
          </div>

          <div className="form-section">
            <div className="input-group">
              <label>Nome</label>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>E-mail*</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Senha*</label>
              <input
                type="password"
                placeholder="Nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
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