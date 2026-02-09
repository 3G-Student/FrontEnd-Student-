import "./perfil.css";
import { FaCamera, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PerfilProfessor() {
    const navigate = useNavigate();
    return (
    <div className="perfil-page">
      {/* Sidebar roxa */}
      <aside className="perfil-sidebar" />

      <div className="perfil-content">
        <header className="perfil-header">
          <div>
            <h2>Perfil</h2>
            <span className="sub">Professor</span>
          </div>
          <span className="student-tag" onClick={() => navigate("/professores")}>STUDENT <span>+</span></span>
        </header>

        <div className="perfil-card">
          {/* ESQUERDA — FOTO */}
          <div className="foto-section">
            <div className="foto-box">
              <FaCamera className="camera-icon" />
            </div>

            <button className="upload-btn">
              <FaUpload />
              Fazer upload de nova foto
            </button>
          </div>

          {/* DIREITA — FORM */}
          <div className="form-section">
            <div className="input-group">
              <label>Nome</label>
              <input type="text" placeholder="Lucas Mendes" />
            </div>

            <div className="input-group">
              <label>E-mail*</label>
              <input type="email" placeholder="lucas.mendes@student.com" />
            </div>

            <div className="input-group">
              <label>Senha*</label>
              <input type="password" placeholder="123456" />
            </div>

            <button className="salvar-btn">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
