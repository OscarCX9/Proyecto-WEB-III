import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/styles.css";
import "../css/stylesLogin.css";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [captchaValido, setCaptchaValido] = useState(false);

  const volver = () => {
    navigate("/");
  };

  const manejarCaptcha = (valor) => {
    if (valor) {
      setCaptchaValido(true);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!captchaValido) {
      alert("Por favor, confirma que no eres un robot 🧠");
      return;
    }
  
    const id_usuario = e.target.id_usuario.value;
    const pass = e.target.pass.value;
  
    try {
      const respuesta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario, pass }),
      });
  
      const datos = await respuesta.json();
  
      if (!respuesta.ok) {
        alert(datos.mensaje || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("id_usuario", id_usuario);
  
      await registrarLog(id_usuario, "ingreso");
      if (datos.rol === "admin") {
        navigate("/administracion");
      } else if (datos.rol === "vendedor") {
        navigate("/ventas");
      } else {
        alert("Rol no reconocido");
      }

    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };
  
const registrarLog = async (id_usuario, evento) => {
  const browser = navigator.userAgent;

  let ip = "desconocida";

  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    ip = data.ip;
  } catch (e) {
    console.log("No se pudo obtener la IP");
  }

  await fetch("http://localhost:3000/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario, ip, browser, evento }),
  });
};

  
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
            <a href="#" className="login-button">Login</a>
          </nav>
        </div>
      </header>

      <main>
        
        <div className="form-container">
          <div className="login-form">
            <h2>Acceder</h2>
            <form method="POST" onSubmit={manejarEnvio}>
              <label htmlFor="username">id_usuario *</label>
              <input type="text" name="id_usuario" placeholder="Introduzca su ID" required />

              <label htmlFor="password">Contraseña *</label>
              <input type="password" name="pass" placeholder="Introduzca su contraseña" required />
              <center><div style={{ margin: "15px 0" }}>
                <ReCAPTCHA
                  sitekey="6LeLwQIsAAAAAPtGFbkgnWYQEo8bHPSYVrbaJgVo"
                  onChange={manejarCaptcha}
                />
              </div>
              </center>       
              <button type="submit" name="inicio" className="btn acceso-btn">
                Acceso
              </button>
              <a href="#" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </form>
            <button onClick={volver} className="btn volver-btn">
              Volver
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;