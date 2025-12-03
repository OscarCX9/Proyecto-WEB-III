import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const obtenerPorRango = async (min, max) => {
  const query = `
    SELECT p.*, s.nombre_subcategoria
    FROM productos p
    JOIN subcategorias s ON p.id_subcat = s.id_subcat
    WHERE p.id_subcat BETWEEN ? AND ?
  `;
  const [rows] = await pool.query(query, [min, max]);
  return rows;
};

export const obtenerSolo = async (id) => {
  const query = `
    SELECT p.*, s.nombre_subcategoria
    FROM productos p
    JOIN subcategorias s ON p.id_subcat = s.id_subcat
    WHERE p.id_subcat = ?
  `;
  const [rows] = await pool.query(query, [id]);
  return rows;
};

export const crearPedido = async (nit, id_producto, cantidad, total) => {
  const [cliente] = await pool.query(
    "SELECT id_cliente FROM clientes WHERE nit = ?",
    [nit]
  );

  if (cliente.length === 0) return null;

  const id_cliente = cliente[0].id_cliente;

  const [ultimo] = await pool.query("SELECT MAX(id_pedido) AS ultimo FROM pedidos");
  const nuevoId = (ultimo[0].ultimo || 0) + 1;

  const fecha_pedido = new Date().toISOString().split("T")[0];
  const estado = "pendiente";

  await pool.query(
    "INSERT INTO pedidos (id_pedido, id_cliente, fecha_pedido, estado, id_producto, cantidad, total) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nuevoId, id_cliente, fecha_pedido, estado, id_producto, cantidad, total]
  );

  return true;
};

export const obtenerPedidosPorNit = async (nit) => {
  const [cliente] = await pool.query(
    "SELECT id_cliente FROM clientes WHERE nit = ?",
    [nit]
  );

  if (cliente.length === 0) return null;

  const id_cliente = cliente[0].id_cliente;

  const [pedidos] = await pool.query(
    `SELECT p.id_pedido, pr.nombre_producto, p.cantidad, p.total, p.estado, p.fecha_pedido
     FROM pedidos p
     JOIN productos pr ON p.id_producto = pr.id_producto
     WHERE p.id_cliente = ? AND p.estado = 'pendiente'`,
    [id_cliente]
  );

  return pedidos;
};

//CANCELAR PEDIDO
export const cancelarPedidoPorId = async (id_pedido) => {
  await pool.query(
    "UPDATE pedidos SET estado = 'cancelado' WHERE id_pedido = ?",
    [id_pedido]
  );
};
//AUTENTIFICACION/LOGUEO
export const buscarUsuarioActivo = async (id_usuario) => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE id_usuario = ? AND estado = 'activo'",
    [id_usuario]
  );
  return rows;
};

//COMPARAR HASH
export const compararPassword = async (pass, hash) => {
  return await bcrypt.compare(pass, hash);
};

export const obtenerPedidosPendientes = async () => {
  const [rows] = await pool.query(`
    SELECT p.id_pedido, 
    c.nombre_cliente, 
    pr.nombre_producto, 
    p.cantidad, p.total, 
    p.fecha_pedido, 
    p.estado 
    FROM pedidos p 
    JOIN clientes c ON p.id_cliente = c.id_cliente 
    JOIN productos pr ON p.id_producto = pr.id_producto 
    WHERE p.estado = 'pendiente';
  `);
  return rows;
};

export const obtenerTodosLosClientes = async () => {
  const [rows] = await pool.query("SELECT * FROM clientes");
  return rows;
};

export const obtenerTodosLosUsuarios = async () => {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  return rows;
};

//ELIMINAR USUARIO
export const eliminarUsuarioDB = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM usuarios WHERE id_usuario = ?",
    [id]
  );
  return result;
};

//ELIMINAR CLIENTE
export const eliminarClienteDB = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM clientes WHERE id_cliente = ?",
    [id]
  );
  return result;
};

export const registrarEntregaDB = async (
  id_pedido,
  id_transportista,
  fecha_salida,
  estado_entrega,
  ubicacion_destino
) => {
  const [result] = await pool.query(
    `INSERT INTO entregas (id_pedido, id_transportista, fecha_salida, estado_entrega, ubicacion_destino)
     VALUES (?, ?, ?, ?, ?)`,
    [id_pedido, id_transportista, fecha_salida, estado_entrega, ubicacion_destino]
  );
  return result;
};

export const actualizarPedidoDistribucionDB = async (id_pedido) => {
  await pool.query(
    `UPDATE pedidos SET estado = 'en_distribucion' WHERE id_pedido = ?`,
    [id_pedido]
  );
};

export const obtenerEntregasEnRutaDB = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id_entrega,
      id_pedido,
      id_transportista,
      fecha_salida,
      estado_entrega,
      ubicacion_destino
    FROM entregas
    WHERE estado_entrega = 'en_ruta'
  `);
  return rows;
};

export const confirmarEntregaDB = async (id) => {
  await pool.query(
    `UPDATE entregas SET estado_entrega = 'entregada' WHERE id_entrega = ?`,
    [id]
  );

  const [entrega] = await pool.query(
    `SELECT id_pedido FROM entregas WHERE id_entrega = ?`,
    [id]
  );

  return entrega.length > 0 ? entrega[0].id_pedido : null;
};

export const actualizarPedidoEntregadoDB = async (id_pedido) => {
  await pool.query(
    `UPDATE pedidos SET estado = 'entregado' WHERE id_pedido = ?`,
    [id_pedido]
  );
};

//REGISTRAR USUARIO
export const registrarUsuarioDB = async (
  id_usuario,
  nombre_usuario,
  correo,
  contraseñaHash,
  rol,
  estado
) => {
  const [result] = await pool.query(
    `INSERT INTO usuarios (id_usuario, nombre_usuario, correo, contraseña, rol, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_usuario, nombre_usuario, correo, contraseñaHash, rol, estado]
  );

  return result;
};

//REGISTRAR CLIENTE
export const registrarClienteDB = async (
  id_cliente,
  nombre_cliente,
  nit,
  direccion,
  telefono,
  correo,
  tipo_cliente
) => {
  const [result] = await pool.query(
    `INSERT INTO clientes 
     (id_cliente, nombre_cliente, nit, direccion, telefono, correo, tipo_cliente)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id_cliente,
      nombre_cliente,
      nit,
      direccion,
      telefono,
      correo,
      tipo_cliente,
    ]
  );

  return result;
};
//GRAFICO ESTADISTICO
export const obtenerBalanceDB = async () => {
  const q = `
      SELECT fecha_salida, COUNT(*) AS cantidad
      FROM entregas
      GROUP BY fecha_salida
      ORDER BY fecha_salida ASC
    `;
  const [rows] = await pool.query(q);
  return rows;
};
/*REPORTE PDF*/
export const obtenerEntregasReporteDB = async () => {
  const [rows] = await pool.query(`
      SELECT 
        id_entrega,
        id_pedido,
        id_transportista,
        fecha_salida,
        estado_entrega,
        ubicacion_destino
      FROM entregas
      ORDER BY fecha_salida ASC
    `);
  return rows;
};
//LOG ACCESO
export const registrarLogDB = async (id_usuario, ip, browser, evento) => {
  await pool.query(
    "INSERT INTO logs (id_usuario, ip, browser, evento) VALUES (?, ?, ?, ?)",
    [id_usuario, ip, browser, evento]
  );
};

