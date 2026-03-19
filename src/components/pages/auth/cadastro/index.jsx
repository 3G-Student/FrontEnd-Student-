import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import Logo from "../../../../assets/logo.svg";
import "./cadastro.css";

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
    const errorMessage =
      (parsed && typeof parsed === "object" && (parsed.message || parsed.mensagem || parsed.error)) ||
      (typeof parsed === "string" ? parsed : "") ||
      `${fallbackMessage} (status ${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (!raw) {
    return null;
  }

  return parsed;
}

async function loginCreatedUser({ backendURL, email, senha }) {
  const loginResponse = await fetch(`${backendURL}/api/Usuario/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  return readResponse(loginResponse, "Nao foi possivel autenticar o usuario criado.");
}

function extractAuthToken(loginData) {
  if (!loginData || typeof loginData !== "object") {
    return null;
  }

  return (
    loginData.token ??
    loginData.accessToken ??
    loginData.jwt ??
    loginData.data?.token ??
    loginData.data?.accessToken ??
    loginData.data?.jwt ??
    null
  );
}

function extractUserIdFromLocation(locationHeader) {
  if (!locationHeader) {
    return null;
  }

  const parts = String(locationHeader).split("/").filter(Boolean);
  const lastPart = parts[parts.length - 1];
  const numericId = Number(lastPart);

  return Number.isFinite(numericId) && numericId > 0 ? numericId : null;
}

function extractUserId(userData) {
  if (!userData || typeof userData !== "object") {
    return null;
  }

  return (
    userData.idUsuario ??
    userData.usuarioId ??
    userData.id ??
    userData.data?.idUsuario ??
    userData.data?.usuarioId ??
    userData.data?.id ??
    userData.usuario?.idUsuario ??
    userData.usuario?.usuarioId ??
    userData.usuario?.id ??
    null
  );
}

async function resolveUserId({ backendURL, email, senha, userData, locationHeader }) {
  const directId = extractUserId(userData) ?? extractUserIdFromLocation(locationHeader);

  if (directId) {
    return directId;
  }

  const loginResponse = await fetch(`${backendURL}/api/Usuario/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const loginData = await readResponse(loginResponse, "Nao foi possivel identificar o usuario criado.");
  const loginId = loginData?.idUsuario ?? loginData?.usuarioId ?? loginData?.id;

  if (!loginId) {
    throw new Error("Nao foi possivel identificar o usuario criado.");
  }

  return loginId;
}

async function createStudentRegistration({
  backendURL,
  normalizedName,
  normalizedMatricula,
  usuarioId,
  token,
}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const registrationAttempts = [
    {
      nome: normalizedName,
      matricula: normalizedMatricula,
      ativo: false,
      usuarioId,
    },
    {
      nome: normalizedName,
      matricula: normalizedMatricula,
      ativo: false,
      idUsuario: usuarioId,
    },
    {
      nome: normalizedName,
      matricula: normalizedMatricula,
      usuarioId,
    },
    {
      nome: normalizedName,
      matricula: normalizedMatricula,
      idUsuario: usuarioId,
    },
    {
      nome: normalizedName,
      matricula: normalizedMatricula,
      ativo: false,
      usuario: { idUsuario: usuarioId },
    },
    {
      nome: normalizedName,
      matricula: normalizedMatricula,
      ativo: false,
      usuario: { id: usuarioId },
    },
  ];

  if (/^\d+$/.test(normalizedMatricula)) {
    registrationAttempts.push({
      nome: normalizedName,
      matricula: Number(normalizedMatricula),
      ativo: false,
      usuarioId,
    });
    registrationAttempts.push({
      nome: normalizedName,
      matricula: Number(normalizedMatricula),
      ativo: false,
      idUsuario: usuarioId,
    });
    registrationAttempts.push({
      nome: normalizedName,
      matricula: Number(normalizedMatricula),
      ativo: false,
      usuario: { idUsuario: usuarioId },
    });
    registrationAttempts.push({
      nome: normalizedName,
      matricula: Number(normalizedMatricula),
      ativo: false,
      usuario: { id: usuarioId },
    });
  }

  let lastError = new Error("Erro ao criar matricula do aluno.");

  for (const payload of registrationAttempts) {
    const alunoResponse = await fetch(`${backendURL}/api/Aluno/cadastrar`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    try {
      return await readResponse(alunoResponse, "Erro ao criar matricula do aluno.");
    } catch (error) {
      lastError = error;

      if (error.status === 401) {
        throw new Error("Erro ao criar matricula do aluno. O backend exige autorizacao para cadastrar aluno.");
      }

      if (![400, 404, 405, 415, 500].includes(error.status)) {
        throw error;
      }
    }
  }

  throw lastError;
}

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

      const normalizedName = nome.trim();
      const normalizedMatricula = matricula.trim();
      const normalizedEmail = email.trim();
      const normalizedPassword = senha;

      const usuarioResponse = await fetch(`${backendURL}/api/Usuario/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: normalizedName,
          email: normalizedEmail,
          senha: normalizedPassword,
          tipoId: 1,
        }),
      });

      const usuarioCriado = await readResponse(usuarioResponse, "Erro ao criar usuario.");
      let loginData = null;

      try {
        loginData = await loginCreatedUser({
          backendURL,
          email: normalizedEmail,
          senha: normalizedPassword,
        });
      } catch {
        loginData = null;
      }

      const authToken = extractAuthToken(loginData) || localStorage.getItem("token");

      const usuarioId = await resolveUserId({
        backendURL,
        email: normalizedEmail,
        senha: normalizedPassword,
        userData: loginData || usuarioCriado,
        locationHeader: usuarioResponse.headers.get("Location"),
      });

      await createStudentRegistration({
        backendURL,
        normalizedName,
        normalizedMatricula,
        usuarioId,
        token: authToken,
      });

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
