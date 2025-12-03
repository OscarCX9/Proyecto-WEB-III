import { useNavigate } from "react-router-dom";
import "../css/styles.css";
import fondo from "../assets/fondo.png";
import logo from "../assets/logo.png";
import logos from "../assets/logos.jpg";

import { Link } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  return (
    <div>
      <header>
        <div className="header-container">
          <h1 className="store-title">
            <span className="nova">NOVA</span>
            <span className="construye">CONSTRUYE</span>
          </h1>
          <nav>
            <a href="#">About Us</a>
            <a href="#">Service</a>
            <a href="#">Contact</a>
            <Link to="/login" className="login-button">Login</Link>
          </nav>
        </div>
      </header>

      <main>
        <section
          className="intro"
          style={{
            backgroundImage: `url(${fondo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="logos">
            <img src={logos} className="logos-img" alt="Logos de productos" />
          </div>
          <div className="description">
            <img src={logo} alt="Logo NovaConstruye" height="290" width="340" />
            <h3>
              Distribución de materiales de Construcción, Herramientas, Accesorios y mucho más...
            </h3>
            <button className="start-button" onClick={() => navigate("/categorias")}>
              INICIO
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Index;
