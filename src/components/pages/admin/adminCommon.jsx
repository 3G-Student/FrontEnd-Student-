export const ENTITY_COLORS = ["#E95B8F", "#95C769", "#B55A27", "#F3C42A", "#7CB2C7", "#1E8667"];

export const ADMIN_TABS = [
  { key: "teachers", label: "Professores" },
  { key: "admins", label: "Admin" },
  { key: "enrollments", label: "Matriculas" },
];

export async function readResponse(response, fallbackMessage) {
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

  if (!raw) {
    return null;
  }

  return parsed;
}

export function buildStudentMetrics(students) {
  const activeStudents = students.filter((student) => student.ativo === true).length;
  const pendingEnrollments = students.filter((student) => student.ativo !== true).length;

  return {
    activeStudents,
    totalStudents: students.length,
    pendingEnrollments,
  };
}

export function normalizeStudent(student, index, usersMap) {
  const userId = student.usuarioId ?? student.idUsuario;

  return {
    id: student.idAluno ?? student.alunoId ?? student.id,
    name: student.nome,
    email: usersMap.get(userId)?.email || "N/A",
    userId,
    matricula: student.matricula || "N/A",
    active: student.ativo === true,
    color: ENTITY_COLORS[index % ENTITY_COLORS.length],
    raw: student,
  };
}

export function getAvatarInitial(name, email = "") {
  const baseValue = String(name || email || "U").trim();

  if (!baseValue) {
    return "U";
  }

  return baseValue.charAt(0).toUpperCase();
}

export function StatsSummary({ stats, middleValue, middleLabel }) {
  const items = [
    { value: stats.activeStudents, label: "Alunos ativos" },
    { value: middleValue, label: middleLabel },
    { value: stats.pendingEnrollments, label: "Matriculas pendentes" },
  ];

  return (
    <div className="stats-bar">
      {items.map((stat) => (
        <div key={stat.label} className="stat-item">
          <span className="stat-value">{stat.value ?? 0}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AdminTabs({ activeTab, onNavigate }) {
  return (
    <div className="register-tabs" aria-label="Alternar area administrativa">
      {ADMIN_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`register-tab-btn ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => onNavigate(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
