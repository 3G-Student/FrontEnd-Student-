import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Pages/professores/login";
import Cadastro from "./components/Pages/professores/cadastro";
import DashboardProfessor from "./components/Pages/professores";
import Perfil from "./components/Pages/perfil";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/professores" element={<DashboardProfessor />} />
        <Route path="/perfilProfessor" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}
