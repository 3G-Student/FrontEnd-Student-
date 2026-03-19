import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../../../assets/logo.svg";
import Notification from "../../../notification/Notification";
import "./login.css";

async function readResponse(response, fallbackMessage) {
  const raw = await response.text();
  let parsed = null;

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw;
    }
  }

  if (!response.ok) {
    const message =
      (parsed && typeof parsed === "object" && (parsed.erro || parsed.message || parsed.mensagem || parsed.error)) ||
      (typeof parsed === "string" ? parsed : "") ||
      fallbackMessage;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return parsed;
}

export default function Login() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const loginBackend = async () => {
    if (!email || !senha) {
      showNotification("Preencha todos os campos.", "error");
      return;
    }

    try {
      setLoading(true);
      closeNotification();

      const response = await fetch(`${backendURL}/api/Usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await readResponse(response, "Usuario ou senha invalidos.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("idUsuario", data.idUsuario);
      localStorage.setItem("idTipoUsuario", data.idTipoUsuario);
      localStorage.setItem("email", email);
      localStorage.setItem("idProfessor", data.idProfessor || "");
      localStorage.setItem("idAluno", data.idAluno || "");
      localStorage.setItem("idSecretario", data.idSecretario || "");

      const tipo = Number(data.idTipoUsuario);
      if (tipo === 1) navigate("/aluno");
      else if (tipo === 2) navigate("/professores");
      else if (tipo === 3) navigate("/admin");
      else navigate("/");

    } catch (err) {
      showNotification(err.message, "error");
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

        <div className="input-group-login">
          <input
            type="email"
            placeholder="E-mail ou matrícula"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              type={verSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="password-wrapper-senha"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setVerSenha((prev) => !prev)}
              aria-label={verSenha ? "Ocultar senha" : "Exibir senha"}
            >
              {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          className="btn-login"
          onClick={loginBackend}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Login"}
        </button>

        <p className="login-text">
          Não tem uma conta?<br />
          <span className="link-login" onClick={() => navigate("/")}>Clique aqui para se cadastrar</span>
        </p>
      </div>
      <Notification {...notification} onClose={closeNotification} />
    </div>
  );
}
