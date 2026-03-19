import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import Sidebar from "../../../components/layout";
import Logo from "../../../assets/logo.svg";
import Notification from "../../notification/Notification";
import {
  AdminTabs,
  ENTITY_COLORS,
  StatsSummary,
  buildStudentMetrics,
  getAvatarInitial,
  readResponse,
} from "./adminCommon";

const DASHBOARD_CONFIG = {
  teachers: {
    title: "Cadastrar professor",
    searchPlaceholder: "Digite nome, e-mail ou id do professor",
    emptyLabel: "Selecione um professor",
    registerSuccess: "Professor cadastrado!",
    registerError: "Erro ao cadastrar professor.",
    deleteSuccess: "Professor excluido!",
    deleteError: "Erro ao excluir professor.",
    deleteConfirm: "Excluir este professor?",
    statsLabel: "Professores ativos",
    removeLabel: "Remover professor",
    activeTab: "teachers",
    userTypeId: 2,
    listEndpoint: "Professor/listar",
    createEndpoint: "Professor/cadastrar",
    deleteEndpoint: (id) => `Professor/excluir/${id}`,
    normalizeItem: (item, index, usersMap) => ({
      id: item.idProfessor ?? item.professorId ?? item.id,
      name: item.nome,
      email: usersMap.get(item.usuarioId)?.email || "N/A",
      userId: item.usuarioId,
      active: item.ativo !== false,
      color: ENTITY_COLORS[index % ENTITY_COLORS.length],
    }),
  },
  admins: {
    title: "Cadastrar admin",
    searchPlaceholder: "Digite nome, e-mail ou id do admin",
    emptyLabel: "Selecione um admin",
    registerSuccess: "Admin cadastrado!",
    registerError: "Erro ao cadastrar admin.",
    deleteSuccess: "Admin excluido!",
    deleteError: "Erro ao excluir admin.",
    deleteConfirm: "Excluir este admin?",
    statsLabel: "Admins ativos",
    removeLabel: "Remover admin",
    activeTab: "admins",
    userTypeId: 3,
    listEndpoint: "Secretario/listar",
    createEndpoint: "Secretario/cadastrar",
    deleteEndpoint: (id) => `Secretario/excluir/${id}`,
    normalizeItem: (item, index, usersMap) => {
      const userId = item.usuarioId ?? item.idUsuario;

      return {
        id: item.idSecretario ?? item.secretarioId ?? item.idAdmin ?? item.idAdministrador ?? item.id,
        name: item.nome,
        email: usersMap.get(userId)?.email || "N/A",
        userId,
        active: item.ativo !== false,
        color: ENTITY_COLORS[index % ENTITY_COLORS.length],
      };
    },
  },
};

function getUserTypeId(user) {
  return Number(
    user.idTipoUsuario ??
      user.tipoId ??
      user.tipoUsuarioId ??
      user.tipoUsuario?.id ??
      user.tipo?.id
  );
}

function buildAdminFallbackName(user, profile) {
  if (profile?.nome) return profile.nome;
  if (user.nome) return user.nome;
  if (user.email) return user.email.split("@")[0];
  return `Admin ${String(user.idUsuario ?? user.id ?? "").padStart(3, "0")}`;
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

function extractCreatedUserId(userData) {
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

async function resolveCreatedUserId({
  backendURL,
  authHeaders,
  email,
  expectedTypeId,
  userData,
  locationHeader,
}) {
  const directId = extractCreatedUserId(userData) ?? extractUserIdFromLocation(locationHeader);

  if (directId) {
    return directId;
  }

  const usersResponse = await fetch(`${backendURL}/api/Usuario/listar`, { headers: authHeaders() });
  const usersData = await readResponse(usersResponse, "Erro ao localizar usuario criado.");

  const matchedUser = (usersData || [])
    .filter((user) => (user.email || "").toLowerCase() === email.toLowerCase())
    .find((user) => getUserTypeId(user) === expectedTypeId);

  if (!matchedUser) {
    throw new Error("Nao foi possivel identificar o usuario criado.");
  }

  return matchedUser.idUsuario ?? matchedUser.usuarioId ?? matchedUser.id;
}

async function createEntityRecord({ backendURL, headers, endpoint, data, fallbackMessage }) {
  const payloadAttempts = [
    { nome: data.nome, ativo: true, usuarioId: data.usuarioId },
    { nome: data.nome, ativo: true, idUsuario: data.usuarioId },
    { nome: data.nome, usuarioId: data.usuarioId },
    { nome: data.nome, idUsuario: data.usuarioId },
    { nome: data.nome, ativo: true, usuario: { idUsuario: data.usuarioId } },
    { nome: data.nome, ativo: true, usuario: { id: data.usuarioId } },
  ];

  let lastError = new Error(fallbackMessage);

  for (const payload of payloadAttempts) {
    const response = await fetch(`${backendURL}/api/${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    try {
      return await readResponse(response, fallbackMessage);
    } catch (error) {
      lastError = error;

      if (![400, 404, 405, 415, 500].includes(error.status)) {
        throw error;
      }
    }
  }

  throw lastError;
}

async function loadAdminUsers({ backendURL, authHeaders }) {
  const usersResponse = await fetch(`${backendURL}/api/Usuario/listar`, { headers: authHeaders() });
  const usersData = await readResponse(usersResponse, "Erro ao carregar usuarios.");
  const adminUsers = (usersData || []).filter((user) => getUserTypeId(user) === 3);

  const adminProfiles = await Promise.all(
    adminUsers.map(async (user) => {
      try {
        const profileResponse = await fetch(`${backendURL}/api/Usuario/perfil/${user.idUsuario}`, {
          headers: authHeaders(),
        });
        const profileData = await readResponse(profileResponse, "Erro ao carregar perfil.");
        return { user, profile: profileData };
      } catch {
        return { user, profile: null };
      }
    })
  );

  return adminProfiles.map(({ user, profile }, index) => ({
    id: user.idUsuario ?? user.id,
    name: buildAdminFallbackName(user, profile),
    email: profile?.email || user.email || "N/A",
    userId: user.idUsuario ?? user.id,
    active: true,
    color: ENTITY_COLORS[index % ENTITY_COLORS.length],
  }));
}

function SearchableEntityList({ items, onSelect, selectedId, searchPlaceholder }) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.email.toLowerCase().includes(normalizedQuery) ||
        String(item.id).includes(query)
      );
    });
  }, [items, query]);

  return (
    <div className="teacher-list-panel">
      <div className="search-bar">
        <input
          className="search-input"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Search className="search-icon" />
      </div>
      <div className="teacher-list-scroll">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`teacher-card ${selectedId === item.id ? "active" : ""}`}
            onClick={() => onSelect(item)}
          >
            <div className="teacher-avatar" style={{ backgroundColor: item.color }}>
              {getAvatarInitial(item.name, item.email)}
            </div>
            <span className="teacher-card-name">{item.name}</span>
            <div className="teacher-card-id-group">
              <span className="id-label">ID</span>
              <span className="id-value">{String(item.id).padStart(6, "0")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationForm({ config, onRegister, showNotification, onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      showNotification("Preencha nome, e-mail e senha.", "error");
      return;
    }

    try {
      setLoading(true);
      await onRegister({ nome: name, email, senha: password, ativo: true });
      showNotification(config.registerSuccess, "success");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      showNotification(error.message || config.registerError, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-card">
      <div className="register-card-header">
        <h2 className="register-title">{config.title}</h2>
        <AdminTabs activeTab={config.activeTab} onNavigate={onNavigate} />
      </div>
      <div className="register-form">
        <div className="form-field">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-input"
            placeholder="Informe o nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className="form-input"
            placeholder="Informe o e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-input"
            placeholder="Digite uma senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className="register-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : "Cadastrar"}
        </button>
      </div>
    </div>
  );
}

function SelectedProfile({ item, config, onDelete }) {
  if (!item) {
    return <div className="teacher-profile-empty">{config.emptyLabel}</div>;
  }

  return (
    <div className="teacher-profile">
      <div className="profile-avatar" style={{ backgroundColor: item.color }}>
        {getAvatarInitial(item.name, item.email)}
      </div>
      <div className="profile-info">
        <h2 className="profile-name">{item.name}</h2>
        <p className="profile-email">{item.email}</p>
        <button className="remove-btn" onClick={() => onDelete(item.id)}>
          <Trash2 size={20} fill="white" />
          {config.removeLabel}
        </button>
      </div>
    </div>
  );
}

export function UserManagementDashboard({ mode }) {
  const navigate = useNavigate();
  const config = DASHBOARD_CONFIG[mode];
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ activeStudents: 0, totalStudents: 0, pendingEnrollments: 0 });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [selectedItem, setSelectedItem] = useState(null);

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

  const loadDashboard = useCallback(async () => {
    try {
      const studentsResponse = await fetch(`${backendURL}/api/Aluno/listar`, { headers: authHeaders() });
      const studentsData = await readResponse(studentsResponse, "Erro ao carregar alunos.");
      let normalizedItems = [];

      if (mode === "admins") {
        normalizedItems = await loadAdminUsers({ backendURL, authHeaders });
      } else {
        const [entityResponse, usersResponse] = await Promise.all([
          fetch(`${backendURL}/api/${config.listEndpoint}`, { headers: authHeaders() }),
          fetch(`${backendURL}/api/Usuario/listar`, { headers: authHeaders() }),
        ]);

        const entityData = await readResponse(entityResponse, "Erro ao carregar lista.");
        const usersData = await readResponse(usersResponse, "Erro ao carregar usuarios.");
        const usersMap = new Map((usersData || []).map((user) => [user.idUsuario, user]));

        normalizedItems = (entityData || []).map((item, index) =>
          config.normalizeItem(item, index, usersMap)
        );
      }

      setItems(normalizedItems);
      setStats(buildStudentMetrics(studentsData || []));
      setSelectedItem((current) => {
        if (!normalizedItems.length) return null;
        return normalizedItems.find((item) => item.id === current?.id) || normalizedItems[0];
      });
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Erro ao carregar a pagina.", "error");
    }
  }, [authHeaders, backendURL, config, mode, showNotification]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRegister = async (data) => {
    const userResponse = await fetch(`${backendURL}/api/Usuario/cadastrar`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        email: data.email,
        senha: data.senha,
        tipoId: config.userTypeId,
        nome: data.nome,
      }),
    });

    const userData = await readResponse(userResponse, config.registerError);
    const usuarioId = await resolveCreatedUserId({
      backendURL,
      authHeaders,
      email: data.email,
      expectedTypeId: config.userTypeId,
      userData,
      locationHeader: userResponse.headers.get("Location"),
    });

    await createEntityRecord({
      backendURL,
      headers: authHeaders(),
      endpoint: config.createEndpoint,
      data: { nome: data.nome, usuarioId },
      fallbackMessage: config.registerError,
    });

    await loadDashboard();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(config.deleteConfirm)) return;

    try {
      const deleteAttempts =
        mode === "admins"
          ? [{ path: config.deleteEndpoint(id) }, { path: `Usuario/excluir/${id}` }]
          : [{ path: config.deleteEndpoint(id) }];

      let deleteSucceeded = false;
      let lastError = null;

      for (const attempt of deleteAttempts) {
        try {
          await readResponse(
            await fetch(`${backendURL}/api/${attempt.path}`, {
              method: "DELETE",
              headers: authHeaders(),
            }),
            config.deleteError
          );
          deleteSucceeded = true;
          break;
        } catch (error) {
          lastError = error;

          if (![400, 404, 405, 500].includes(error.status)) {
            throw error;
          }
        }
      }

      if (!deleteSucceeded && lastError) {
        throw lastError;
      }

      showNotification(config.deleteSuccess, "success");
      await loadDashboard();
    } catch (error) {
      showNotification(error.message || config.deleteError, "error");
    }
  };

  const activeEntityCount = items.filter((item) => item.active !== false).length;

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
              middleValue={activeEntityCount}
              middleLabel={config.statsLabel}
            />
            <RegistrationForm
              config={config}
              onRegister={handleRegister}
              showNotification={showNotification}
              onNavigate={navigateTab}
            />
            <div className="profile-separator" />
            <SelectedProfile item={selectedItem} config={config} onDelete={handleDelete} />
          </section>

          <aside className="admin-right">
            <SearchableEntityList
              items={items}
              onSelect={setSelectedItem}
              selectedId={selectedItem?.id}
              searchPlaceholder={config.searchPlaceholder}
            />
          </aside>
        </div>
      </main>
      <Notification {...notification} onClose={closeNotification} />
    </div>
  );
}

export default function DashboardAdmin() {
  return <UserManagementDashboard mode="teachers" />;
}
