import { useState, useEffect } from "react";
import "../css/stylesP.css";

function Categorias() {
  const [categoria, setCategoria] = useState("materialesDeObraGruesa");
  const [productos, setProductos] = useState({});
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [total, setTotal] = useState(0);
  const [nit, setNit] = useState("");

  const cargarCategoria = async (cat) => {
    setCategoria(cat);
    setProductoSeleccionado(null);
    try {
      const respuesta = await fetch(`http://localhost:3000/${cat}`);
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos({});
    }
  };

  useEffect(() => {
    if (productoSeleccionado) {
      const nuevoTotal = productoSeleccionado.precio * cantidad;
      setTotal(nuevoTotal);
    }
  }, [cantidad, productoSeleccionado]);


const enviarPedido = async () => {
  if (!productoSeleccionado) return;

  const pedido = {
    nit: nit,
    id_producto: productoSeleccionado.id_producto,
    cantidad: cantidad,
    total: total,
  };

  try {
    const respuesta = await fetch("http://localhost:3000/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });

    if (respuesta.ok) {
      alert("Pedido registrado correctamente");
      setProductoSeleccionado(null);
      setCantidad(1);
      setNit("");
    } else {
      alert("Error al registrar el pedido");
    }
  } catch (error) {
    console.error("Error al enviar pedido:", error);
  }
};


const [mostrarModalNIT, setMostrarModalNIT] = useState(false);
const [mostrarModalPedidos, setMostrarModalPedidos] = useState(false);
const [pedidos, setPedidos] = useState([]);

const verPedidosPendientes = async () => {
  try {
    const respuesta = await fetch(`http://localhost:3000/pedidos/${nit}`);
    if (!respuesta.ok) {
      alert("Cliente no encontrado o sin pedidos pendientes");
      return;
    }
    const data = await respuesta.json();
    setPedidos(data);
    setMostrarModalNIT(false);
    setMostrarModalPedidos(true);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
  }
};

const cancelarPedido = async (id_pedido) => {
  try {
    const respuesta = await fetch(`http://localhost:3000/pedidos/cancelar/${id_pedido}`, {
      method: "PUT",
    });
    if (respuesta.ok) {
      alert("Pedido cancelado");
      setPedidos(pedidos.filter((p) => p.id_pedido !== id_pedido));
    }
  } catch (error) {
    console.error("Error al cancelar pedido:", error);
  }
};


  return (
    <div className="app-container">
      <header className="header">
        <h1 className="store-title">
          <span className="electronics">NOVA</span>
          <span className="store">CONSTRUYE</span>
        </h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="search-bar"
          />
          <button className="search-button">🔍</button>
          <button className="cart-button">🛒</button>
        </div>
      </header>

      <main className="main-container">
        <aside className="sidebar">
          <br />
          <button
            className="category-button"
            onClick={() => cargarCategoria("materialesDeObraGruesa")}
          >
            Materiales de obra gruesa
          </button>
          <button
            className="category-button"
            onClick={() => cargarCategoria("materialesDeInstalacionyAcabado")}
          >
            Materiales de instalación y acabado
          </button>
          <button
            className="category-button"
            onClick={() => cargarCategoria("herramientasyEquipos")}
          >
            Herramientas y Equipos
          </button>
          <button
            className="category-button"
            onClick={() => cargarCategoria("otros")}
          >
            Otros
          </button>
          

<button
  className="category-button"
  onClick={() => setMostrarModalNIT(true)}
>
  Pedidos
</button>

{mostrarModalNIT && (
  <div className="modal-overlay">
    <div className="modal-contenido">
      <h2 className="colortexto1"><center>Introduzca su Nro. de NIT</center></h2>

      <div className="form-row-column">
        <center><label className="colortexto1">Nro. de NIT: </label>
        <input
          type="text"
          placeholder="Ejemplo: 147891245"
          name="nit"
          value={nit}
          onChange={(e) => setNit(e.target.value)}
          required
        />
        </center>
      </div>

      <div className="form-buttons">
        <button onClick={verPedidosPendientes} className="info-button">
          Aceptar
        </button>
        <button
          className="cancel-button"
          onClick={() => setMostrarModalNIT(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{mostrarModalPedidos && (
  <div className="modal-overlay">
    <div className="modal-contenido2">
      <h2 className="colortexto1"><center>Pedidos Pendientes</center></h2>
      {pedidos.length === 0 ? (
        <p>No tiene pedidos pendientes.</p>
      ) : (
        <table className="tabla-pedidos">
          <thead>
            <tr>
          
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total (Bs)</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id_pedido}>
                
                <td>{p.nombre_producto}</td>
                <td>{p.cantidad}</td>
                <td>{p.total}</td>
                
                <td>{p.fecha_pedido.split('T')[0]}</td>

                <td>
                  <button
                    className="cancel-button"
                    onClick={() => cancelarPedido(p.id_pedido)}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="form-buttons">
        <button
          className="info-button"
          onClick={() => setMostrarModalPedidos(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}
          
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <button 
            className="category-button" 
            onClick={() => window.location.href = "/"}
          >
            Salir
          </button>
        </aside>

        <section className="novelties-section">
          {Object.keys(productos).length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            Object.entries(productos).map(([nombre_subcategoria, lista]) => (
              <div key={nombre_subcategoria} className="subcategory-section">
                <h2 className="subcategory-title">{nombre_subcategoria}</h2>
                <div className="products-grid">
                  {lista.map((prod) => (
                    <div className="product-card" key={prod.id}>
                      <img
                        src={prod.url_imagen}
                        className="product-image"
                        alt={prod.nombre_producto}
                        height="150px"
                      />
                      <h2 className="product-name">{prod.nombre_producto}</h2>
                      <div className="tooltip">
                        {prod.descripcion || "Sin descripción."}
                      </div>
                      <p className="product-price">
                        Bs {prod.precio} / {prod.unidad}
                      </p>
                      <button
                        className="info-button"
                        onClick={() => setProductoSeleccionado(prod)}
                      >
                        Pedido
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {productoSeleccionado && (
            <div className="modal-overlay">
              <div className="modal-contenido">
              <h2 className="colortexto1">
                <center>Solicitud de Pedido</center></h2>
              <p>
                <strong className="colortexto1">Producto:</strong> {productoSeleccionado.nombre_producto}
              </p>
              <p>
                <strong className="colortexto1">Precio unitario:</strong> Bs {productoSeleccionado.precio}
              </p>

<div className="form-row">
  <label className="colortexto1">Cantidad:</label>
  <input
    type="number"
    min="1"
    value={cantidad}
    onChange={(e) => setCantidad(parseInt(e.target.value))}
  />
  <span>{productoSeleccionado.unidad}</span>
  
</div>

<input type='hidden' value={productoSeleccionado.id_producto} />

<div className="form-row">
  <label className="colortexto1">Nro. de NIT:</label>
  <input
    type="text"
    placeholder="Introduce tu NIT"
    name="nit"
    value={nit}
    onChange={(e) => setNit(e.target.value)}
    required
  />
</div>

              <p>
                <strong className="colortexto1">Total:</strong> Bs {total.toFixed(2)}
              </p>

              <div className="form-buttons">
                <button onClick={enviarPedido} className="info-button">
                  Confirmar Pedido
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setProductoSeleccionado(null)}
                >
                  Cancelar
                </button>
              </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Categorias;

