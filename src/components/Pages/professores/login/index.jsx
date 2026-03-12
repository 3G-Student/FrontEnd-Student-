import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });
      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("idUsuario", data.idUsuario);
      localStorage.setItem("idTipoUsuario", data.idTipoUsuario);
      localStorage.setItem("idProfessor", data.idProfessor);
      localStorage.setItem("idAluno", data.idAluno);
      localStorage.setItem("idSecretario", data.idSecretario);
      navigate("/professores");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <div className="cadastro-left">
          <h1 className="logo">STUDENT<span>+</span></h1>
          <p>Entre na sua conta para continuar</p>
        </div>
        <div className="cadastro-right">
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input  type="password"  placeholder="Senha"  value={senha}  onChange={(e) => setSenha(e.target.value)}/>
          {erro && <p style={{ color: "red" }}>{erro}</p>}
          <button  className="btn-cadastrar" onClick={loginBackend} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
