import { useState } from "react";
import "./professores.css";
import Logo from "../assets/logo.svg";
import Aviao from "../assets/aviao.svg";

export default function DashboardProfessor() {
  const alunos = [
    { nome: "João Silva", matricula: "024567", cor: "#7ED957" },
    { nome: "Lucas Campos", matricula: "984901", cor: "#FF5C8A" },
    { nome: "Sara de Oliveira", matricula: "762736", cor: "#8B4513" },
    { nome: "Ana Clara Gomes", matricula: "872935", cor: "#FFC300" },
    { nome: "César de Souza", matricula: "092345", cor: "#5DADE2" },
    { nome: "João Santana", matricula: "567893", cor: "#1E8449" },
    { nome: "Guilherme Francisco", matricula: "445472", cor: "#F4D03F" },
    { nome: "Miriam Ferraz", matricula: "345227", cor: "#FF6F91" },
  ];

  const [alunoSelecionado, setAlunoSelecionado] = useState(alunos[0]);
  const [nota1, setNota1] = useState(7.5);
  const [nota2, setNota2] = useState(7.5);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [toastObs, setToastObs] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [observacao, setObservacao] = useState("");
  const [mensagens, setMensagens] = useState([]);

  const media = ((nota1 + nota2) / 2).toFixed(1);

  let status = "Aprovado";
  if (media < 6) status = "Reprovado";
  else if (media < 7) status = "Recuperação";

  const alunosFiltrados = alunos.filter((aluno) => {
    const termo = pesquisa.toLowerCase();
    return (
      aluno.nome.toLowerCase().includes(termo) ||
      aluno.matricula.includes(termo)
    );
  });

  const enviarObservacao = () => {
    if (!observacao.trim()) return;
    setMensagens([
      { nome: alunoSelecionado.nome, texto: observacao },
      ...mensagens,
    ]);
    setObservacao("");
    setToastObs(true);
    setTimeout(() => setToastObs(false), 3000);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-perfil">
          <div className="avatar-sidebar">J</div>
        </div>
      </aside>
      
      <main className="main">

      <div className="breadcrumb">
        <span className="home">Home</span>
        <span className="professor">Professor</span>
      </div>


        <h1 className="titulo">{alunoSelecionado.nome}</h1>

        <section className="card notas">
          <div className="topo-notas">
            <h2 className="tituloNota">Lançar notas</h2>
            <div className={`status ${status.toLowerCase()}`}>{status}</div>
          </div>

          <div className="notas-inputs">
            <div>
              <span className="divNota1">Nota 1</span>
              <input type="number" value={nota1} onChange={e => setNota1(+e.target.value)} />
            </div>
            <div className="menosPraEsquerda">
              <span>Nota 2</span>
              <input type="number" value={nota2} onChange={e => setNota2(+e.target.value)} />
            </div>
            <div>
              <span>Média</span>
              <input type="number" value={media} readOnly />
            </div>

            <button className="registrar-notas" onClick={() => setMostrarConfirmacao(true)}>
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
              <div className="mensagem">
                <div className="msg-header">
                  <div className="msg-avatar"></div>
                  <div className="msg-user">
                    <strong>Catarina Mendes da Costa</strong>
                    <span>Enviou uma observação</span>
                  </div>
                </div>
                <p className="msg-texto">
                  Bom dia, João! Sua prova substituta foi agendada para o dia 27/02.
                </p>
              </div>

              {mensagens.map((msg, i) => (
                <div key={i} className="mensagem nova">
                  <div className="msg-header">
                    <div className="msg-avatar"></div>
                    <div className="msg-user">
                      <strong>{msg.nome}</strong>
                      <span>Observação enviada agora</span>
                    </div>
                  </div>
                  <p className="msg-texto">{msg.texto}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <aside className="alunos">
        <img className="student" src={Logo} />
        <input
          placeholder="Pesquisar aluno"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

        <div className="lista-alunos">
          {alunosFiltrados.map((a, i) => (
            <div key={i} className="aluno" onClick={() => setAlunoSelecionado(a)}>
              <div className="bolinha" style={{ background: a.cor }} />
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

      {mostrarConfirmacao && (
        <div className="overlay">
          <div className="modal">
            <h3>Confirmar registro?</h3>
            <div className="modal-botoes">
              <button onClick={() => setMostrarConfirmacao(false)}>Cancelar</button>
              <button
                onClick={() => {
                  setMostrarConfirmacao(false);
                  setMostrarSucesso(true);
                  setTimeout(() => setMostrarSucesso(false), 3000);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarSucesso && <div className="toast-sucesso">Notas registradas!</div>}
      {toastObs && <div className="toast-sucesso">Observação enviada!</div>}
    </div>
  );
}
