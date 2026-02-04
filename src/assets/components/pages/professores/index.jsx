import "./professores.css";
import Logo from "../../../../assets/logo.svg"
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

  return (
    <div className="layout">
      <aside className="sidebar"></aside>

      <main className="main">
        <h1 className="titulo">João Silva</h1>

        <section className="card notas">
          <h2 className="tituloNota">Lançar notas</h2>
          <div className="notas-inputs">
            <div>
              <span>Nota 1</span>
              <input className="notass" type="number" defaultValue="7.5" />
            </div>
            <div>
              <span>Nota 2</span>
              <input className="notass" type="number" defaultValue="7.5" />
            </div>
            <div>
              <span>Media</span>
              <input className="notass"  type="number" defaultValue="7.5" />
            </div>
            <button></button>
          </div>
        </section>

        <div className="linha-inferior">
          <section className="card enviar">
            <h2>Enviar observação</h2>
            <textarea placeholder="Digite sua observação"></textarea>
          </section>

          <section className="card enviadas obeserva">
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
                  Se tiver alguma dúvida, por favor entre em contato.
                </p>
              </div>
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
                  Se tiver alguma dúvida, por favor entre em contato.
                </p>
              </div>

            </div>
          </section>
        </div>
      </main>

      <aside className="alunos">
        <img className="student" src={Logo}></img>
        <input placeholder="Digite a matrícula do aluno" />

        <div className="lista-alunos">
          {alunos.map((a, i) => (
            <div key={i} className="aluno">
              <div className="bolinha" style={{ background: a.cor }} />
              <div className="infoAluno">
                <strong className="nomeAluno">{a.nome}</strong>
                <div className="matriculaBox">
                  <span className="matriculaLabel">Matrícula</span>
                  <span className="matriculaNumero">{a.matricula}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
