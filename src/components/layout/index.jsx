import { useNavigate } from "react-router-dom";
import "./SideBar.css"; 

export default function Sidebar() {
  const navigate = useNavigate();
  
  const nome = localStorage.getItem("nomeUsuario");
  const email = localStorage.getItem("email");
  const inicial = (nome || email || "U").charAt(0).toUpperCase();

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
