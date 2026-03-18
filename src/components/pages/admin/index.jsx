import { useState, useEffect } from "react";
import './admin.css';
import Sidebar from "../../../components/SideBar";
import StatsBar from '../../../components/StatsBar';
import RegisterTeacher from '../../../components/RegisterTeacher';
import TeacherProfile from '../../../components/TeacherProfile';
import TeacherList from '../../../components/TeacherList';
import Logo from "../../../assets/logo.svg";
import Notification from "../../../components/notification/Notification";

export default function DashboardAdmin() {
  const [teachers, setTeachers] = useState([]);
  // const backendURL = import.meta.env.VITE_BACKEND_URL;
  const backendURL = "http://localhost:8080"
  const token = localStorage.getItem("token");

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const carregarProfessores = () => {
    fetch(`${backendURL}/api/Professor/listar`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      const professoresFormatados = data.map(p => ({
        id: p.idProfessor,
        nome: p.nome,
        ativo: p.ativo,
        cor: gerarCor(p.nome)
      }));
  
      setTeachers(professoresFormatados);
    })
    .catch(() => showNotification("Erro ao carregar professores", "error"));
  };
  useEffect(() => { carregarProfessores(); }, []);

  const handleRegister = async (newTeacher) => {
    carregarProfessores();
  };
  const gerarCor = (nome) => {
    const cores = [
      "#38B6F5",
      "#695CAC",
      "#A59FF3",
      "#5A54A3",
      "#7B7794"
    ];
  
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    return cores[Math.abs(hash) % cores.length];
  };
  const handleDelete = async (id) => {
    if(window.confirm("Deseja realmente excluir?")) {
        await fetch(`${backendURL}/api/Professor/deletar/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        carregarProfessores();
    }
  };

  return (
    <div className="app-root">
      <Sidebar />

      <Notification 
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <main className="main-content">
        <header className="main-header">
          <div>
            <h1 className="header-title">Home</h1>
            <p className="header-subtitle">Secretaria</p>
          </div>
          <img className="logo-student" src={Logo} />
        </header>

        <div className="content-area">
          <div className="left-panel">
            <StatsBar />

            <RegisterTeacher 
              onRegister={handleRegister}
              showNotification={showNotification}
            />
            <TeacherProfile 
              teacher={selectedTeacher}
              onDelete={handleDelete}
            />
          </div>

          <div className="right-panel">
            <TeacherList 
              teachers={teachers}
              onSelect={setSelectedTeacher}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
