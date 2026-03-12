import { useState } from "react";
import "./cadastro.css";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
          tipoId: 1
        }),
      });
      if (!usuarioResponse.ok) {
        throw new Error("Erro ao criar usuário");
      }
      const usuarioCriado = await usuarioResponse.json();
      const usuarioId = usuarioCriado.idUsuario;

      const alunoResponse = await fetch(`${backendURL}/api/aluno/cadastrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          matricula,
          ativo: false,
          usuarioId: usuarioId
        }),
      });
      if (!alunoResponse.ok) {
        throw new Error("Erro ao criar aluno");
      }
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
          <p>
            Seja bem-vindo ao Student+! Crie <br />
            sua conta para começar a usar.
          </p>
        </div>
        <div className="cadastro-right">
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)}/>
          <input type="text" placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)}/>
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>
          {erro && <p style={{ color: "red" }}>{erro}</p>}
          <button className="btn-cadastrar" onClick={cadastrarBackend} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <small>
            Já tem uma conta?{" "}
            <a onClick={() => navigate("/login")}>
              Clique aqui para fazer login
            </a>
          </small>

        </div>

      </div>
    </div>
  );
}