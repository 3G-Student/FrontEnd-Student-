import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import Logo from "../../../assets/logo.svg";
import "./cadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();
  // const backendURL = import.meta.env.VITE_BACKEND_URL;
  const backendURL = "http://localhost:8080"

  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const cadastrarBackend = async () => {
    if (!nome || !matricula || !email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      setErro(null);
      const usuarioResponse = await fetch(`${backendURL}/api/Usuario/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha, tipoId: 1 }),
      });
      if (!usuarioResponse.ok) throw new Error("Erro ao criar usuário");

      const usuarioCriado = await usuarioResponse.json();
      const usuarioId = usuarioCriado.idUsuario;

      const alunoResponse = await fetch(`${backendURL}/api/Aluno/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          matricula,
          ativo: false,
          usuarioId: usuarioId
        }),
      });
      if (!alunoResponse.ok) throw new Error("Erro ao criar aluno");

      navigate("/login"); 

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
          <img className="logo" src={Logo} alt="Student+" />
          <p>
            Seja bem-vindo!<br />
            Crie sua conta para começar a utilizar.
          </p>
        </div>
        <div className="cadastro-right">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="text"
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />

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
              {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {erro && <p className="error-message">{erro}</p>}

          <button
            className="btn-cadastrar"
            onClick={cadastrarBackend}
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <small className="footer-text">
            Já tem uma conta?<br />
            <span className="link-login" onClick={() => navigate("/login")}>
              Clique aqui para fazer login
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}