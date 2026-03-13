import { useEffect, useState } from "react";
import Sidebar from "../../components/SideBar";
import "./perfil.css";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [senha, setSenha] = useState("");
  
  const idUsuario = localStorage.getItem("idUsuario");
  const idTipoUsuario = localStorage.getItem("idTipoUsuario");
  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!idUsuario) return;

    fetch(`${backendURL}/api/Usuario/buscarPorId/${idUsuario}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setUser(data);
      if(data.nome) localStorage.setItem("nomeUsuario", data.nome);
    })
    .catch(err => console.error("Erro ao carregar perfil:", err));
  }, [idUsuario, token, backendURL]);

  const getTipoLabel = () => {
    const tipo = Number(idTipoUsuario);
    if (tipo === 1) return "Perfil do Aluno";
    if (tipo === 2) return "Perfil do Professor";
    return "Perfil Administrativo";
  };

  if (!user) return <div className="loading">Carregando...</div>;

  return (
    <div className="app-root">
      <Sidebar />
      
      <main className="main-content">
        <div className="profile-container">
          <header className="profile-header">
            <h1>{getTipoLabel()}</h1>
            <p>Informações da conta</p>
          </header>

          <div className="profile-card">
            <div className="profile-avatar-large">
              {user.nome?.charAt(0).toUpperCase() || localStorage.getItem("email")?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>Nome</label>
                <input value={user.nome || ""} readOnly className="input-disabled" />
              </div>

              <div className="form-group">
                <label>E-mail</label>
                <input value={user.email || ""} readOnly className="input-disabled" />
              </div>

              {Number(idTipoUsuario) === 1 && (
                <div className="form-group">
                  <label>Matrícula</label>
                  <input value={localStorage.getItem("idAluno") || "---"} readOnly className="input-disabled" />
                </div>
              )}

              <hr />
              <h3>Segurança</h3>
              <div className="form-group">
                <label>Nova Senha</label>
                <input 
                  type="password" 
                  placeholder="Alterar senha" 
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)} 
                />
              </div>
              <button className="btn-save" onClick={() => alert("Funcionalidade de senha em breve!")}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}