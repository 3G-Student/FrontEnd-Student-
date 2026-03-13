import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../../assets/logo.svg";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const loginBackend = async () => {
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      setErro(null);
      const response = await fetch(`${backendURL}/api/Usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) throw new Error("Usuário ou senha inválidos");

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("idUsuario", data.idUsuario);
      localStorage.setItem("idTipoUsuario", data.idTipoUsuario);
      localStorage.setItem("email", email);
      localStorage.setItem("idProfessor", data.idProfessor || "");
      localStorage.setItem("idAluno", data.idAluno || "");

      const tipo = Number(data.idTipoUsuario);
      if (tipo === 1) navigate("/aluno");
      else if (tipo === 2) navigate("/professores");
      else if (tipo === 3) navigate("/admin");
      else navigate("/");

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img className="logo" src={Logo} alt="Student+" />
        <p className="welcome-text">
          Seja bem-vindo!<br />
          Realize seu login para prosseguir.
        </p>
        
        <div className="input-group">
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <div className="password-wrapper">
            <input 
              type={verSenha ? "text" : "password"} 
              placeholder="Senha" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setVerSenha(!verSenha)}
            >
              {verSenha ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </div>

        {erro && <span className="error-message">{erro}</span>}

        <button className="btn-login" onClick={loginBackend} disabled={loading}>
          {loading ? "Carregando..." : "Login"}
        </button>

        <p className="login-text">
          Não tem uma conta?<br />
          <span className="link-login" onClick={() => navigate("/")}>
            Clique aqui para se cadastrar
          </span>
        </p>
      </div>
    </div>
  );
}