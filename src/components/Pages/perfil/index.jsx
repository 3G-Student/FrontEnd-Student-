import "./perfil.css";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function PerfilProfessor() {

  const navigate = useNavigate();

  const [popupSucesso, setPopupSucesso] = useState(false);
  const [popupErro, setPopupErro] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [totalObservacoes, setTotalObservacoes] = useState(0);

  // const backendURL = import.meta.env.VITE_BACKEND_URL;
  const backendURL = "http://localhost:8080"
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
    fetch(`${backendURL}/api/Usuario/perfil/${usuarioId}`, {
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
      setPopupErro("Usuário não encontrado");
      setTimeout(() => setPopupErro(""), 3000);
      return;
    }

    if (!validarSenha(novaSenha)) {
      setPopupErro(
        "A senha precisa ter 8 caracteres, com maiúscula, minúscula, número e caractere especial."
      );
      setTimeout(() => setPopupErro(""), 4000);
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
      setPopupErro("Usuário não encontrado");
      setTimeout(() => setPopupErro(""), 3000);
      return;     
    }
  };

  useEffect(() => {

    const idProfessor = localStorage.getItem("idProfessor");
    const token = localStorage.getItem("token");
  
    if (!idProfessor) return;
  
    fetch(`${backendURL}/api/Observacao/buscarObservacoesPorIdProfessor/${idProfessor}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar observações");
        }
        return response.json();
      })
      .then((data) => {
        setTotalObservacoes(data.length);
  
      })
      .catch((error) => {
        console.error("Erro ao buscar observações:", error);
      });
  
  }, []);

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
          <div className="perfil-info-card">''
            <div className="avatar-professor">
              {nome ? nome.charAt(0).toUpperCase() : "P"}
            </div>
            <h3 className="prof-nome">{nome}</h3>
            <p className="prof-email">{email}</p>
            <div className="prof-info-extra">
              <span>Tipo de conta</span>
              <strong  className="strong-tipo">Professor</strong>
            </div>
            <div className="prof-info-extra">
              <span>Status</span>
              <strong className="status-ativo">Ativo</strong>
            </div>
            <div className="prof-info-extra">
              <span>Observações enviadas</span>
              <strong className="strong-tipo">{totalObservacoes}</strong>
            </div>
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
      {popupErro && (
        <div className="toast-erro">
          {popupErro}
        </div>
      )}
    </div>
  );
}