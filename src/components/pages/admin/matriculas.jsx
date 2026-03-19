import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import Sidebar from "../../../components/layout";
import Logo from "../../../assets/logo.svg";
import Notification from "../../notification/Notification";
import {
  AdminTabs,
  StatsSummary,
  buildStudentMetrics,
  ensureArray,
  getAvatarInitial,
  normalizeStudent,
  readResponse,
} from "./adminCommon";

const APPROVAL_ATTEMPTS = [
  { method: "PUT", path: (id) => `Aluno/atualizar/${id}` },
  { method: "PATCH", path: (id) => `Aluno/atualizar/${id}` },
  { method: "PUT", path: (id) => `Aluno/editar/${id}` },
  { method: "PATCH", path: (id) => `Aluno/editar/${id}` },
];

function ApprovalCard({ student, onApprove, onReject, onNavigate, loadingAction }) {
  return (
    <div className="register-card">
      <div className="register-card-header">
        <h2 className="register-title">Aprovar matricula</h2>
        <AdminTabs activeTab="enrollments" onNavigate={onNavigate} />
      </div>
      {student ? (
        <>
          <div className="register-form student-approval-form">
            <div className="form-field">
              <label className="form-label">Nome</label>
              <input type="text" className="form-input" value={student.name} readOnly />
            </div>
            <div className="form-field">
              <label className="form-label">E-mail</label>
              <input type="text" className="form-input" value={student.email} readOnly />
            </div>
            <div className="form-field form-field-small">
              <label className="form-label">Matricula</label>
              <input type="text" className="form-input" value={student.matricula} readOnly />
            </div>
          </div>
          <div className="approval-card-footer">
            <span className="approval-status-chip">Pendente</span>
            <div className="approval-actions">
              <button
                className="reject-btn"
                onClick={() => onReject(student)}
                disabled={loadingAction !== null}
              >
                <X size={18} />
                {loadingAction === "reject" ? "Reprovando..." : "Reprovar"}
              </button>
              <button
                className="approve-btn"
                onClick={() => onApprove(student)}
                disabled={loadingAction !== null}
              >
              <Check size={18} />
                {loadingAction === "approve" ? "Aprovando..." : "Aprovar matricula"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="teacher-profile-empty">Nenhuma matricula pendente no momento.</div>
      )}
    </div>
  );
}

function SelectedStudentProfile({ student, onApprove, onReject, loadingAction }) {
  if (!student) {
    return <div className="teacher-profile-empty">Nenhum aluno pendente selecionado.</div>;
  }

  return (
    <div className="teacher-profile">
      <div className="profile-avatar" style={{ backgroundColor: student.color }}>
        {getAvatarInitial(student.name, student.email)}
      </div>
      <div className="profile-info">
        <h2 className="profile-name">{student.name}</h2>
        <p className="profile-email">{student.email}</p>
        <div className="student-profile-meta">
          <span className="student-meta-chip">Matricula {student.matricula}</span>
          <span className="student-meta-chip pending">Pendente</span>
        </div>
        <div className="profile-actions">
          <button
            className="reject-btn approve-btn-large"
            onClick={() => onReject(student)}
            disabled={loadingAction !== null}
          >
            <X size={18} />
            {loadingAction === "reject" ? "Reprovando..." : "Reprovar matricula"}
          </button>
          <button
            className="approve-btn approve-btn-large"
            onClick={() => onApprove(student)}
            disabled={loadingAction !== null}
          >
            <Check size={18} />
            {loadingAction === "approve" ? "Aprovando..." : "Aprovar matricula"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EnrollmentList({ students, selectedId, onSelect }) {
  const [query, setQuery] = useState("");

  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(normalizedQuery) ||
        student.email.toLowerCase().includes(normalizedQuery) ||
        student.matricula.toLowerCase().includes(normalizedQuery) ||
        String(student.id).includes(query)
      );
    });
  }, [students, query]);

  return (
    <div className="teacher-list-panel">
      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Digite nome, id ou matricula"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Search className="search-icon" />
      </div>
      <div className="teacher-list-scroll">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className={`teacher-card student-card ${selectedId === student.id ? "active" : ""}`}
            onClick={() => onSelect(student)}
          >
            <div className="teacher-avatar" style={{ backgroundColor: student.color }}>
              {getAvatarInitial(student.name, student.email)}
            </div>
            <div className="student-card-body">
              <span className="teacher-card-name">{student.name}</span>
              <span className="student-card-meta">Matricula {student.matricula}</span>
            </div>
            <div className="teacher-card-id-group">
              <span className="id-label">ID</span>
              <span className="id-value">{String(student.id).padStart(6, "0")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function approveStudent({ backendURL, headers, student }) {
  const payload = {
    ...student.raw,
    idAluno: student.id,
    nome: student.raw?.nome ?? student.name,
    matricula: student.raw?.matricula ?? student.matricula,
    usuarioId: student.raw?.usuarioId ?? student.raw?.idUsuario ?? student.userId,
    ativo: true,
  };

  let lastError = new Error("Nao foi possivel aprovar a matricula.");

  for (const attempt of APPROVAL_ATTEMPTS) {
    const response = await fetch(`${backendURL}/api/${attempt.path(student.id)}`, {
      method: attempt.method,
      headers,
      body: JSON.stringify(payload),
    });

    try {
      return await readResponse(response, "Nao foi possivel aprovar a matricula.");
    } catch (error) {
      lastError = error;

      if (![400, 404, 405].includes(error.status)) {
        throw error;
      }
    }
  }

  throw lastError;
}

async function rejectStudentRegistration({ backendURL, headers, student }) {
  const deleteAttempts = [{ path: `Aluno/excluir/${student.id}` }];

  if (student.userId) {
    deleteAttempts.push({ path: `Usuario/excluir/${student.userId}` });
  }

  let deletedSomething = false;
  let lastError = new Error("Nao foi possivel reprovar a matricula.");

  for (const attempt of deleteAttempts) {
    const response = await fetch(`${backendURL}/api/${attempt.path}`, {
      method: "DELETE",
      headers,
    });

    try {
      await readResponse(response, "Nao foi possivel reprovar a matricula.");
      deletedSomething = true;
    } catch (error) {
      lastError = error;

      if (error.status === 404) {
        continue;
      }

      if (![400, 405, 500].includes(error.status)) {
        throw error;
      }
    }
  }

  if (!deletedSomething) {
    throw lastError;
  }
}

export default function DashboardMatriculas() {
  const navigate = useNavigate();
  const [pendingStudents, setPendingStudents] = useState([]);
  const [stats, setStats] = useState({ activeStudents: 0, totalStudents: 0, pendingEnrollments: 0 });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState({ id: null, type: null });

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const authHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const closeNotification = useCallback(() => {
    setNotification({ message: "", type: "" });
  }, []);

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
  }, []);

  const navigateTab = useCallback(
    (tab) => {
      const routeMap = {
        teachers: "/admin",
        admins: "/admin/admins",
        enrollments: "/admin/matriculas",
      };

      navigate(routeMap[tab]);
    },
    [navigate]
  );

  const loadPendingStudents = useCallback(async () => {
    try {
      const [studentsResponse, usersResponse] = await Promise.all([
        fetch(`${backendURL}/api/Aluno/listar`, { headers: authHeaders() }),
        fetch(`${backendURL}/api/Usuario/listar`, { headers: authHeaders() }),
      ]);

      const studentsData = await readResponse(studentsResponse, "Erro ao carregar alunos.");
      const usersData = await readResponse(usersResponse, "Erro ao carregar usuarios.");
      
      console.log("DEBUG: studentsData =", studentsData);
      console.log("DEBUG: usersData =", usersData);

      const usersList = ensureArray(usersData);
      const studentsList = ensureArray(studentsData);
      
      console.log("DEBUG: usersList =", usersList);
      console.log("DEBUG: studentsList =", studentsList);
      
      const usersMap = new Map(usersList.map((user) => [user.idUsuario, user]));
      const normalizedStudents = studentsList.map((student, index) =>
        normalizeStudent(student, index, usersMap)
      );
      const pending = normalizedStudents.filter((student) => !student.active);

      console.log("DEBUG: pending =", pending);

      setStats(buildStudentMetrics(studentsList));
      setPendingStudents(pending);
      setSelectedStudent((current) => {
        if (!pending.length) return null;
        return pending.find((student) => student.id === current?.id) || pending[0];
      });
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Erro ao carregar matriculas.", "error");
    }
  }, [authHeaders, backendURL, showNotification]);

  useEffect(() => {
    loadPendingStudents();
  }, [loadPendingStudents]);

  const handleApprove = async (student) => {
    try {
      setActionLoading({ id: student.id, type: "approve" });
      await approveStudent({
        backendURL,
        headers: authHeaders(),
        student,
      });
      showNotification("Matricula aprovada com sucesso!", "success");
      await loadPendingStudents();
    } catch (error) {
      showNotification(error.message || "Nao foi possivel aprovar a matricula.", "error");
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const handleReject = async (student) => {
    if (!window.confirm("Reprovar esta matricula e excluir aluno e usuario?")) return;

    try {
      setActionLoading({ id: student.id, type: "reject" });
      await rejectStudentRegistration({
        backendURL,
        headers: authHeaders(),
        student,
      });
      showNotification("Matricula reprovada com sucesso!", "success");
      await loadPendingStudents();
    } catch (error) {
      showNotification(error.message || "Nao foi possivel reprovar a matricula.", "error");
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-text">
            <h1>Home</h1>
            <span>Secretaria</span>
          </div>
          <img src={Logo} alt="Student+" className="header-logo" />
        </header>

        <div className="admin-grid">
          <section className="admin-left">
            <StatsSummary
              stats={stats}
              middleValue={stats.totalStudents}
              middleLabel="Alunos cadastrados"
            />
            <ApprovalCard
              student={selectedStudent}
              onApprove={handleApprove}
              onReject={handleReject}
              onNavigate={navigateTab}
              loadingAction={actionLoading.id === selectedStudent?.id ? actionLoading.type : null}
            />
            <div className="profile-separator" />
            <SelectedStudentProfile
              student={selectedStudent}
              onApprove={handleApprove}
              onReject={handleReject}
              loadingAction={actionLoading.id === selectedStudent?.id ? actionLoading.type : null}
            />
          </section>

          <aside className="admin-right">
            <EnrollmentList
              students={pendingStudents}
              selectedId={selectedStudent?.id}
              onSelect={setSelectedStudent}
            />
          </aside>
        </div>
      </main>
      <Notification {...notification} onClose={closeNotification} />
    </div>
  );
}
