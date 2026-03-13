import { useNavigate } from "react-router-dom";
import "./SideBar.css"; 

export default function Sidebar() {
  const navigate = useNavigate();
  const idTipoUsuario = localStorage.getItem("idTipoUsuario");
  
  const nome = localStorage.getItem("nomeUsuario");
  const email = localStorage.getItem("email");
  const inicial = (nome || email || "U").charAt(0).toUpperCase();

  const handleHome = () => {
    const tipo = Number(idTipoUsuario);
    if (tipo === 1) navigate("/aluno");
    else if (tipo === 2) navigate("/professores");
    else navigate("/admin");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-perfil" onClick={() => navigate("/perfil")} title="Meu Perfil">
          <div className="avatar-sidebar">{inicial}</div>
        </div>
      </div>
    </aside>
  );
}