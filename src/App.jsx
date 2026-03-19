import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/pages/auth/login"
import Cadastro from "./components/pages/auth/cadastro"
import Aluno from "./components/pages/aluno/"
import Professores from "./components/pages/professores"
import Admin, { UserManagementDashboard } from "./components/pages/admin"
import Matriculas from "./components/pages/admin/matriculas"
import Perfil from "./components/pages/perfil"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/aluno" element={<Aluno />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/admins" element={<UserManagementDashboard mode="admins" />} />
        <Route path="/admin/matriculas" element={<Matriculas />} />
      </Routes>
    </BrowserRouter>
  );
}
