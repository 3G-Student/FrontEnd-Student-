import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login"
import Cadastro from "./pages/auth/cadastro"
import Aluno from "./pages/aluno"
import Professores from "./pages/professores"
import Admin from "./pages/admin"
import Perfil from "./pages/perfil"

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
      </Routes>
    </BrowserRouter>
  );
}