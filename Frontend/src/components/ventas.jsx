import { useState } from "react";
import "../css/stylesP.css";
import "../css/stylesTabla.css";

import { useNavigate } from "react-router-dom";

function Ventas() {

  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const cargarClientes = async () => {
    try {
      const response = await fetch("http://localhost:3000/clientes");
      const data = await response.json();
      setClientes(data);
      setPedidos([]);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const cargarPedidosPendientes = async () => {
    try {
      const response = await fetch("http://localhost:3000/pedido/pendiente");
      const data = await response.json();
      setPedidos(data);
      setClientes([]);
    } catch (error) {
      console.error("Error al cargar pedidos pendientes:", error);
    }
  };

  const abrirFormularioEntrega = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMostrarModal(true);
  };

  const guardarEntrega = async (e) => {
    e.preventDefault();

    const formData = {
      id_pedido: pedidoSeleccionado.id_pedido,
      id_transportista: e.target.id_transportista.value,
      fecha_salida: e.target.fecha_salida.value,
      estado_entrega: "en_ruta",
      ubicacion_destino: e.target.ubicacion_destino.value,
    };

    try {
      const response = await fetch("http://localhost:3000/entregas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Entrega registrada y pedido actualizado correctamente.");
        setMostrarModal(false);
        cargarPedidosPendientes();
      } else {
        alert("Error al registrar la entrega.");
      }
    } catch (error) {
      console.error("Error al guardar entrega:", error);
    }
  };

const [entregas, setEntregas] = useState([]);

const cargarEntregasEnRuta = async () => {
  try {
    const response = await fetch("http://localhost:3000/entregas/en_ruta");
    const data = await response.json();
    setEntregas(data);
    setClientes([]);
    setPedidos([]);
  } catch (error) {
    console.error("Error al cargar entregas en ruta:", error);
  }
};

const confirmarEntrega = async (id_entrega) => {
  try {
    await fetch(`http://localhost:3000/entregas/${id_entrega}/confirmar`, {
      method: "PUT",
    });

    setEntregas((prevEntregas) =>
      prevEntregas.filter((e) => e.id_entrega !== id_entrega)
    );
  } catch (error) {
    console.error("Error al confirmar entrega:", error);
  }
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
          <button className="category-button" onClick={cargarClientes}>
            Clientes
          </button>
          <button className="category-button" onClick={cargarPedidosPendientes}>
            Pedidos Pendientes
          </button>
          <button className="category-button" onClick={cargarEntregasEnRuta}>
            Entregas
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
          {clientes.length > 0 ? (
            <table className="tabla-pedidos2">
              <thead>
                <tr>
                  <th>ID Cliente</th>
                  <th>Nombre Cliente</th>
                  <th>NIT</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Tipo Cliente</th>
                  
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id_cliente}>
                    <td>{c.id_cliente}</td>
                    <td>{c.nombre_cliente}</td>
                    <td>{c.nit}</td>
                    <td>{c.direccion}</td>
                    <td>{c.telefono}</td>
                    <td>{c.correo}</td>
                    <td>{c.tipo_cliente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : pedidos.length > 0 ? (
            <table className="tabla-pedidos2">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Total (Bs)</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id_pedido}>
                    <td>{p.nombre_cliente}</td>
                    <td>{p.nombre_producto}</td>
                    <td>{p.cantidad}</td>
                    <td>{p.total}</td>
                    <td>{p.fecha_pedido.split("T")[0]}</td>
                    <td>{p.estado}</td>
                    <td>
                      <button
                        className="entregar2-btn"
                        onClick={() => abrirFormularioEntrega(p)}
                      >
                        Entregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          
          

          ) : entregas.length > 0 ? (
            <table className="tabla-pedidos2">
              <thead>
                <tr>
                  <th>ID Entrega</th>
                  <th>ID Pedido</th>
                  <th>ID Transportista</th>
                  <th>Fecha Salida</th>
                  <th>Ubicación Destino</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {entregas.map((e) => (
                  <tr key={e.id_entrega}>
                    <td>{e.id_entrega}</td>
                    <td>{e.id_pedido}</td>
                    <td>{e.id_transportista}</td>
                    <td>{e.fecha_salida.split("T")[0]}</td>
                    <td>{e.ubicacion_destino}</td>
                    <td>{e.estado_entrega}</td>
                    <button
  className="entregar3-btn"
  onClick={() => confirmarEntrega(e.id_entrega)}
>
  Confirmado
</button>

                  </tr>
                ))}
              </tbody>
            </table>          
          ) : (
            <p>No hay clientes ni pedidos pendientes.</p>
          )}
        </section>
      </main>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <center><h2>Registrar Entrega</h2></center>
            <form onSubmit={guardarEntrega}>
              
              <label>ID Transportista:</label>
              <input type="number" name="id_transportista" required />

              <label>Fecha de salida:</label>
              <input type="date" name="fecha_salida" required />

              <label>Ubicación destino:</label>
              <input type="text" name="ubicacion_destino" required />

              <div className="botones">
                <button type="submit" className="guardar">Guardar</button>
                <button type="button" className="cancelar" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          
        </div>
      )}
    </div>
  );
}

export default Ventas;
