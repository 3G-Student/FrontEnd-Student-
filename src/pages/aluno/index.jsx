import { useState, useEffect } from "react";
import './aluno.css';
import Logo from "../../assets/logo.svg";
import Sidebar from "../../components/SideBar";

export default function DashboardAluno() {
  const [boletim, setBoletim] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [dadosAluno, setDadosAluno] = useState(null);
  
  // const backendURL = import.meta.env.VITE_BACKEND_URL;
  const backendURL = "http://localhost:8080"
  const token = localStorage.getItem("token");
  const idAluno = localStorage.getItem("idAluno");

  useEffect(() => {
    if (!idAluno) return;

    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${backendURL}/api/Aluno/buscarPorId/${idAluno}`, { headers })
      .then(res => res.json())
      .then(data => setDadosAluno(data))
      .catch(err => console.error("Erro aluno:", err));

    fetch(`${backendURL}/api/Disciplina/listar`, { headers })
      .then(res => res.json())
      .then(data => setDisciplinas(data))
      .catch(err => console.error("Erro disciplinas:", err));

    fetch(`${backendURL}/api/Boletim/buscarBoletimPorIdAluno/${idAluno}`, { headers })
      .then(res => res.json())
      .then(data => setBoletim(data))
      .catch(err => console.error("Erro boletim:", err));

    fetch(`${backendURL}/api/Observacao/buscarObservacoesPorIdAluno/${idAluno}`, { headers })
      .then(res => res.json())
      .then(data => setNotificacoes(data))
      .catch(err => console.error("Erro obs:", err));
  }, [idAluno, token, backendURL]);

  const getNomeDisciplina = (id) => {
    const disc = disciplinas.find(d => d.idDisciplina === id);
    return disc ? disc.nome : "Carregando...";
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <div className="topnav">
          <div className="topnav-left">
            <span className="topnav-home">Home</span>
            <span className="topnav-breadcrumb">Aluno</span>
          </div>
          <img className="logo-student" src={Logo} alt="Logo" />
        </div>

        <div className="page-heading">
          <h1 className="student-name">{dadosAluno?.nome || "Carregando..."}</h1>
          <h2 className="notifications-title">Minhas notificações</h2>
        </div>

        <div className="body-columns">
          <div className="boletim-card">
            <h2 className="boletim-title">Boletim</h2>
            <div className="grades-card">
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Matéria</th>
                    <th>N1</th>
                    <th>N2</th>
                    <th>Média Final</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {boletim.length > 0 ? (
                    boletim.map((item, index) => {
                      const n1 = item.nota1;
                      const n2 = item.nota2;
                      const media = item.media || (Number(n1 || 0) + Number(n2 || 0)) / 2;

                      let situacao = "Aprovado";
                      let situacaoClass = "status-aprovado";

                      if (n1 === null || n2 === null) {
                        situacao = "Pendente";
                        situacaoClass = "status-pendente";
                      } else if (media < 7) {
                        situacao = "Reprovado";
                        situacaoClass = "status-reprovado";
                      }

                      return (
                        <tr key={index}>
                          <td>{getNomeDisciplina(item.disciplinaId)}</td>
                          <td>{n1 !== null ? n1 : "-"}</td>
                          <td>{n2 !== null ? n2 : "-"}</td>
                          <td className="final-grade">{media.toFixed(1)}</td>
                          <td>
                            <span className={`status-badge ${situacaoClass}`}>
                              {situacao}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                        Nenhuma nota lançada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="notifications-col">
            <div className="notifications-list">
              {notificacoes.map((notif) => (
                <div key={notif.idObservacao} className="notif-card">
                  <div className="notif-avatar"></div>
                  <div className="notif-body">
                    <div className="notif-name">{notif.nomeProfessor || "Professor"}</div>
                    <div className="notif-subtitle">Enviou uma observação • {notif.dataObs}</div>
                    <div className="notif-text">{notif.descricao}</div>
                  </div>
                </div>
              ))}
              {notificacoes.length === 0 && <p className="no-notif">Nenhuma notificação.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}