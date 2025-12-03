import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./components/Index";
import Categorias from "./components/categorias";
import Login from "./components/login";
import Administracion from "./components/administracion";
import Ventas from "./components/ventas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/login" element={<Login />} />
        <Route path="/administracion" element={<Administracion />} />
        <Route path="/ventas" element={<Ventas />} />
      </Routes>
    </Router>
  );
}

export default App;



