import { useState, useEffect } from "react";
import "./professores.css";
import Logo from "../../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import SideBar from "../../../components/SideBar";

export default function DashboardProfessor() {
  const backendURL = "http://localhost:8080";

  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [toastErro, setToastErro] = useState("");
  const [toastObs, setToastObs] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [observacao, setObservacao] = useState("");
  const [observacoes, setObservacoes] = useState([]);
  const [disciplinasProfessor, setDisciplinasProfessor] = useState([]);
  const [disciplinasComNome, setDisciplinasComNome] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let media = "";
  let status = "Pendente";

  if (nota1 !== "" && nota2 !== "") {
    media = ((Number(nota1) + Number(nota2)) / 2).toFixed(1);

    if (media < 6) status = "Reprovado";
    else if (media < 7) status = "Recuperação";
    else status = "Aprovado";
  }

  const alunosFiltrados = alunos.filter((aluno) => {
    const termo = pesquisa.toLowerCase();
    return (
      aluno.nome.toLowerCase().includes(termo) ||
      aluno.matricula.includes(termo)
    );
  });

  const handleNota = (valor, setNota) => {
    if (valor === "") {
      setNota("");
      return;
    }

    const numero = Number(valor);
    if (numero < 0 || numero > 10) return;

    setNota(numero);
  };

  const gerarCorAvatar = (nome) => {
    const cores = [
      "#6366F1","#8B5CF6","#EC4899","#F43F5E",
      "#F59E0B","#10B981","#06B6D4","#3B82F6"
    ];

    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }

    return cores[Math.abs(hash % cores.length)];
  };

  useEffect(() => {
    fetch(`${backendURL}/api/Aluno/listar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const text = await response.text();

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${text}`);
        }

        return JSON.parse(text);
      })
      .then((data) => {
        const alunosAtivos = data.filter((aluno) => aluno.ativo === true);
        setAlunos(alunosAtivos);

        if (alunosAtivos.length > 0) {
          setAlunoSelecionado(alunosAtivos[0]);
        }
      })
      .catch((error) => {
        console.error("ERRO COMPLETO:", error);
        setToastErro(error.message);
        setTimeout(() => setToastErro(""), 3000);
      });
  }, []);

  useEffect(() => {
    if (!alunoSelecionado) return;

    fetch(
      `${backendURL}/api/Observacao/buscarObservacoesPorIdAluno/${alunoSelecionado.idAluno}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar observações");
        return response.json();
      })
      .then((data) => {
        setObservacoes(data);
      })
      .catch(() => {
        setToastErro("Erro ao buscar observações");
        setTimeout(() => setToastErro(""), 3000);
      });
  }, [alunoSelecionado]);

  const enviarObservacao = () => {
    if (!observacao.trim() || !alunoSelecionado) return;

    const professorId = localStorage.getItem("idProfessor");
    const dataAtual = new Date().toISOString().split("T")[0];

    fetch(`${backendURL}/api/Observacao/cadastrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        descricao: observacao,
        dataObs: dataAtual,
        alunoId: alunoSelecionado.idAluno,
        professorId: Number(professorId),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao enviar observação");
        return response.text();
      })
      .then(() => {
        setObservacao("");
        setToastObs(true);

        return fetch(
          `${backendURL}/api/Observacao/buscarObservacoesPorIdAluno/${alunoSelecionado.idAluno}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      })
      .then((res) => res.json())
      .then((data) => {
        setObservacoes(data);
        setTimeout(() => setToastObs(false), 3000);
      })
      .catch(() => {
        setToastErro("Erro ao enviar observação");
        setTimeout(() => setToastErro(""), 3000);
      });
  };

  useEffect(() => {
    const professorId = Number(localStorage.getItem("idProfessor"));

    fetch(`${backendURL}/api/professorDisciplina/listar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar disciplinas");
        return response.json();
      })
      .then(async (data) => {
        const disciplinas = data.filter(
          (item) => item.professorId === professorId
        );

        const disciplinasComNome = await Promise.all(
          disciplinas.map(async (d) => {
            const res = await fetch(
              `${backendURL}/api/Disciplina/buscarPorId/${d.disciplinaId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const disc = await res.json();

            return {
              ...d,
              nome: disc.nome,
            };
          })
        );

        setDisciplinasProfessor(disciplinas);
        setDisciplinasComNome(disciplinasComNome);

        if (disciplinasComNome.length === 1) {
          setDisciplinaSelecionada(disciplinasComNome[0].disciplinaId);
        }
      })
      .catch(() => {
        setToastErro("Erro ao buscar disciplinas");
        setTimeout(() => setToastErro(""), 3000);
      });
  }, []);

  const cadastrarBoletim = () => {
    if (!disciplinaSelecionada || !alunoSelecionado) {
      setToastErro("Disciplina ou aluno não encontrado");
      setTimeout(() => setToastErro(""), 3000);
      return;
    }

    if (nota1 === "" || nota2 === "") {
      setToastErro("Preencha as duas notas antes de enviar");
      setTimeout(() => setToastErro(""), 3000);
      return;
    }

    fetch(`${backendURL}/api/Boletim/cadastrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        disciplinaId: disciplinaSelecionada,
        alunoId: alunoSelecionado.idAluno,
        nota1: nota1,
        nota2: nota2,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao cadastrar boletim");
        return response.text();
      })
      .then(() => {
        setMostrarSucesso(true);
        setTimeout(() => setMostrarSucesso(false), 3000);
      })
      .catch(() => {
        setToastErro("Erro ao cadastrar boletim");
        setTimeout(() => setToastErro(""), 3000);
      });
  };

  return (
    <div className="layout">
      <SideBar />

      <main className="main">
        <div className="breadcrumb">
          <span className="home">Home</span>
          <span className="professor">Professor</span>
        </div>

        <h1 className="titulo">
          {alunoSelecionado ? alunoSelecionado.nome : "Carregando..."}
        </h1>

        <section className="card notas">
          <div className="topo-notas">
            <h2 className="tituloNota">Lançar notas</h2>
            <div className={`status ${status.toLowerCase()}`}>{status}</div>
          </div>

          <div className="notas-inputs">
            <div>
              <span className="divNota1">Nota 1</span>
              <input
                type="number"
                value={nota1}
                onChange={(e) => handleNota(e.target.value, setNota1)}
              />
            </div>

            <div className="menosPraEsquerda">
              <span>Nota 2</span>
              <input
                type="number"
                value={nota2}
                onChange={(e) => handleNota(e.target.value, setNota2)}
              />
            </div>

            {disciplinasComNome.length > 1 && (
              <div>
                <span>Disciplina</span>
                <select
                  value={disciplinaSelecionada || ""}
                  onChange={(e) =>
                    setDisciplinaSelecionada(Number(e.target.value))
                  }
                >
                  <option value="">Selecione</option>

                  {disciplinasComNome.map((d) => (
                    <option key={d.disciplinaId} value={d.disciplinaId}>
                      {d.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <span>Média</span>
              <input type="number" value={media} readOnly />
            </div>

            <button className="registrar-notas" onClick={cadastrarBoletim}>
              Registrar
            </button>
          </div>
        </section>

        <div className="linha-inferior">
          <section className="card enviar">
            <h2>Enviar observação</h2>
            <textarea
              placeholder="Digite sua observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
            <button className="registrar-notass" onClick={enviarObservacao}>
              Enviar
            </button>
          </section>

          <section className="card enviadas">
            <h2>Observações enviadas</h2>

            <div className="lista-mensagens">
              {observacoes.map((obs) => (
                <div key={obs.idObservacao} className="mensagem">
                  <div className="msg-header">
                    <div className="msg-avatar"></div>
                    <div className="msg-user">
                      <strong>{alunoSelecionado?.nome}</strong>
                      <span>{obs.dataObs}</span>
                    </div>
                  </div>
                  <p className="msg-texto">{obs.descricao}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <aside className="alunos">
        <img className="student" src={Logo} alt="Logo" />
        <input
          placeholder="Pesquisar aluno"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

        <div className="lista-alunos">
          {alunosFiltrados.map((a) => (
            <div
              key={a.idAluno}
              className="aluno"
              onClick={() => setAlunoSelecionado(a)}
            >
              <div
                className="bolinha"
                style={{ backgroundColor: gerarCorAvatar(a.nome) }}
              >
                {a.nome.charAt(0).toUpperCase()}
              </div>

              <div className="infoAluno">
                <strong className="nomeAluno">{a.nome}</strong>
                <div className="matriculaBox">
                  <span className="span1">Matrícula</span>
                  <span className="span2">{a.matricula}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {mostrarSucesso && (
        <div className="toast-sucesso">
          Nota cadastrada com sucesso!
        </div>
      )}

      {toastObs && (
        <div className="toast-sucesso">
          Observação enviada com sucesso!
        </div>
      )}

      {toastErro && (
        <div className="toast-erro">
          {toastErro}
        </div>
      )}
    </div>
  );
}