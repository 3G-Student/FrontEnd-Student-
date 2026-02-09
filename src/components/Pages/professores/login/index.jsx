import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">

        <div className="cadastro-left">
          <h1 className="logo">STUDENT<span>+</span></h1>
          <p>Entre na sua conta para continuar</p>
        </div>

        <div className="cadastro-right">
          <input type="email" placeholder="E-mail" />
          <input type="password" placeholder="Senha" />

          <button className="btn-cadastrar" onClick={() => navigate("/professores")}>
            Entrar
          </button>
        </div>

      </div>
    </div>
  );
}
