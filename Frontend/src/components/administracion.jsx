import { useState } from "react";
import "../css/stylesP.css";
import { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

function Administracion() {

  const navigate = useNavigate();

  const [vista, setVista] = useState(""); 
  const [formData, setFormData] = useState({
    id_usuario: "",         
    nombre_usuario: "",
    correo: "",
    contraseña: "",
    rol: "",
    estado: "activo" 
  });

  const [formCliente, setFormCliente] = useState({
    id_cliente: "",
    nombre_cliente: "",
    nit: "",
    direccion: "",
    telefono: "",
    correo: "",
    tipo_cliente: ""
  });

  const handleChangeCliente = (e) => {
    setFormCliente({
      ...formCliente,
      [e.target.name]: e.target.value
    });
  };
  
  const [passwordStrength, setPasswordStrength] = useState(""); 
  const [mensaje, setMensaje] = useState("");

  const cargarCategoria = (cat) => {
    setVista(cat);
    setMensaje("");
  };

  const verificarFuerza = (pass) => {
    let fuerza = "Débil";
    if (pass.length >= 6 && /[A-Z]/.test(pass) && /[0-9]/.test(pass))
      fuerza = "Intermedio";
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass))
      fuerza = "Fuerte";
    setPasswordStrength(fuerza);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contraseña") verificarFuerza(value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      setMensaje(data.message || "Error desconocido");
  
      if (res.ok) {
        setFormData({
          id_usuario: "",
          nombre_usuario: "",
          correo: "",
          contraseña: "",
          rol: "",
          estado: "activo"
        });
        setPasswordStrength(""); 
      }
    } catch (error) {
      setMensaje("Error en el servidor");
    }
  };
  
  const registrarCliente = async (e) => {
    e.preventDefault();
    setMensaje("");
  
    try {
      const res = await fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formCliente),
      });
  
      const data = await res.json();
      setMensaje(data.msg || data.errores?.[0]?.msg);
  
      if (res.ok) {
        setFormCliente({
          id_cliente: "",
          nombre_cliente: "",
          nit: "",
          direccion: "",
          telefono: "",
          correo: "",
          tipo_cliente: ""
        });
      }
  
    } catch (error) {
      setMensaje("Error en el servidor");
    }
  };
  
  const [usuarios, setUsuarios] = useState([]);
  const [clientesTabla, setClientesTabla] = useState([]);
  const cargarUsuarios = async () => {
  try {
    const res = await fetch("http://localhost:3000/usuarios");
    const data = await res.json();
    setUsuarios(data);
  } catch (error) {
    setMensaje("Error al cargar usuarios");
  }
  };

  const cargarTablaClientes = async () => {
  try {
    const res = await fetch("http://localhost:3000/clientes");
    const data = await res.json();
    setClientesTabla(data);
  } catch (error) {
    setMensaje("Error al cargar clientes");
  }
  };

  const eliminarUsuario = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setUsuarios(usuarios.filter(u => u.id_usuario !== id));
      setMensaje("Usuario eliminado");
    }
  } catch (error) {
    setMensaje("Error al eliminar usuario");
  }
};

const eliminarCliente = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/clientes/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setClientesTabla(clientesTabla.filter(c => c.id_cliente !== id));
      setMensaje("Cliente eliminado");
    }
  } catch (error) {
    setMensaje("Error al eliminar cliente");
  }
};

  const formularioRegistrarUsuario = (
    <form onSubmit={registrarUsuario} className="form-registro4">
      <h2>Registrar Usuario</h2>
    
      <label>ID Usuario</label>
      <input
        type="text"
        name="id_usuario"
        value={formData.id_usuario}
        onChange={handleChange}
        required
      />

      <label>Nombre de Usuario</label>
      <input
        type="text"
        name="nombre_usuario"
        value={formData.nombre_usuario}
        onChange={handleChange}
        required
      />

      <label>Correo</label>
      <input
        type="email"
        name="correo"
        value={formData.correo}
        onChange={handleChange}
        required
      />

      <label>Contraseña</label>
      <input
        type="password"
        name="contraseña"
        value={formData.contraseña}
        onChange={handleChange}
        required
      />
      <p>Contraseña: <strong>{passwordStrength}</strong></p>

      <label>Rol</label>
      <select name="rol" value={formData.rol} onChange={handleChange} required>
        <option value="">Seleccione</option>
        <option value="admin">Administrador</option>
        <option value="vendedor">Vendedor</option>
      </select>

      

      <button type="submit" className="category-button">Registrar</button>
      <p>{mensaje}</p>
    </form>
  );

  const formularioRegistrarCliente = (
    <form onSubmit={registrarCliente} className="form-registro4">
      <h2>Registrar Cliente</h2>
      <label>ID Cliente</label>
<input
  type="text"
  name="id_cliente"
  value={formCliente.id_cliente}
  onChange={handleChangeCliente}
  required
/>

      <label>Nombre Cliente</label>
      <input
        type="text"
        name="nombre_cliente"
        value={formCliente.nombre_cliente}
        onChange={handleChangeCliente}
        required
      />
  
      <label>NIT</label>
      <input
        type="text"
        name="nit"
        value={formCliente.nit}
        onChange={handleChangeCliente}
        required
      />
  
      <label>Dirección</label>
      <input
        type="text"
        name="direccion"
        value={formCliente.direccion}
        onChange={handleChangeCliente}
        required
      />
  
      <label>Teléfono</label>
      <input
        type="text"
        name="telefono"
        value={formCliente.telefono}
        onChange={handleChangeCliente}
        required
      />
  
      <label>Correo</label>
      <input
        type="email"
        name="correo"
        value={formCliente.correo}
        onChange={handleChangeCliente}
        required
      />
  
      <label>Tipo de Cliente</label>
      <select
        name="tipo_cliente"
        value={formCliente.tipo_cliente}
        onChange={handleChangeCliente}
        required
      >
        <option value="">Seleccione</option>
        <option value="empresa">Empresa</option>
        <option value="constructora">Constructora</option>
        <option value="particular">Particular</option>
      </select>
  
      <button type="submit" className="category-button">
        Registrar
      </button>
  
      <p>{mensaje}</p>
    </form>
  );

  
  const tablaUsuarios = (
  <table className="tabla-listado">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Estado</th>
        <th>Acción</th>
      </tr>
    </thead>

    <tbody>
      {usuarios.map(u => (
        <tr key={u.id_usuario}>
          <td>{u.id_usuario}</td>
          <td>{u.nombre_usuario}</td>
          <td>{u.correo}</td>
          <td>{u.rol}</td>
          <td>{u.estado}</td>
          <td>
            <button
              className="btn-eliminar"
              onClick={() => eliminarUsuario(u.id_usuario)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const tablaClientes = (
  <table className="tabla-listado">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>NIT</th>
        <th>Dirección</th>
        <th>Teléfono</th>
        <th>Correo</th>
        <th>Tipo</th>
        <th>Acción</th>
      </tr>
    </thead>

    <tbody>
      {clientesTabla.map(c => (
        <tr key={c.id_cliente}>
          <td>{c.id_cliente}</td>
          <td>{c.nombre_cliente}</td>
          <td>{c.nit}</td>
          <td>{c.direccion}</td>
          <td>{c.telefono}</td>
          <td>{c.correo}</td>
          <td>{c.tipo_cliente}</td>
          <td>
            <button
              className="btn-eliminar"
              onClick={() => eliminarCliente(c.id_cliente)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const [balanceData, setBalanceData] = useState([]);

const cargarBalance = async () => {
  try {
    const res = await fetch("http://localhost:3000/balance");
    const data = await res.json();
    setBalanceData(data);
  } catch (error) {
    console.log("Error cargando balance");
  }
};

useEffect(() => {
  if (vista === "Balance") cargarBalance();
}, [vista]);

const descargarPDF = async () => {
  const response = await fetch("http://localhost:3000/reporte-entregas");
  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte_entregas.pdf";
  a.click();
};

const cerrarSesion = async () => {
  const id_usuario = localStorage.getItem("id_usuario");
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
    body: JSON.stringify({
      id_usuario,
      ip,
      browser,
      evento: "salida",
    }),
  });

  localStorage.removeItem("id_usuario");

  setTimeout(() => {
    navigate("/");
  }, 50);
};


  return (
    <div className="app-container">
      <header className="header">
        <h1 className="store-title">
          <span className="electronics">NOVA</span>
          <span className="store">CONSTRUYE</span>
        </h1>
      </header>

      <main className="main-container">
        <aside className="sidebar">
          <br />
          <button
            className="category-button"
            onClick={() => cargarCategoria("RegistrarUsuario")}
          >
            Registrar Usuario
          </button>
          <button
            className="category-button"
            onClick={() => cargarCategoria("RegistrarCliente")}
          >
            Registrar Cliente
          </button>

          <button
            className="category-button"
            onClick={() => { cargarCategoria("EliminarUsuario"); cargarUsuarios(); }}
          >
          Eliminar Usuario
          </button>
          <button
            className="category-button"
            onClick={() => { cargarCategoria("EliminarCliente"); cargarTablaClientes(); }}
          >
          Eliminar Cliente
          </button>

          <button onClick={descargarPDF} className="category-button">
            Descargar PDF
          </button>

          <button
            className="category-button"
            onClick={() => cargarCategoria("Balance")}
          >
            Balance
          </button>
          <br />
          <button
            className="category-button"
            onClick={cerrarSesion}
          >
            Cerrar Sesion
          </button>


        </aside>

        <section className="novelties-section">
          {vista === "RegistrarUsuario" && formularioRegistrarUsuario}
          {vista === "RegistrarCliente" && formularioRegistrarCliente}

          {vista === "EliminarUsuario" && tablaUsuarios}
          {vista === "EliminarCliente" && tablaClientes}

          {vista === "Balance" && (
          <center><div>
            <br />
            <h2 className="h2-grafico">Balance de Entregas por Día</h2>
            <br />
            <LineChart width={800} height={400} data={balanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha_salida" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cantidad" stroke="#8884d8" />
            </LineChart>
          </div>
          </center>
          )}


        </section>
      </main>
    </div>
  );
}

export default Administracion;


