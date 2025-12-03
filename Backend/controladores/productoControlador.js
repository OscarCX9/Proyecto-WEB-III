import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import PDFDocument from "pdfkit";

import { obtenerPorRango, 
        obtenerSolo,
        crearPedido,
        obtenerPedidosPorNit,
        cancelarPedidoPorId,
        buscarUsuarioActivo,
        compararPassword,
        obtenerPedidosPendientes,
        obtenerTodosLosClientes,
        obtenerTodosLosUsuarios,
        eliminarUsuarioDB,
        eliminarClienteDB,
        registrarEntregaDB,
        actualizarPedidoDistribucionDB,
        obtenerEntregasEnRutaDB,
        confirmarEntregaDB,
        actualizarPedidoEntregadoDB,
        registrarUsuarioDB,
        registrarClienteDB,
        obtenerBalanceDB,
        obtenerEntregasReporteDB,
        registrarLogDB } from "../modelos/productoModelo.js";

const agrupar = (rows) => {
  const agrupado = {};
  rows.forEach(prod => {
    if (!agrupado[prod.nombre_subcategoria]) {
      agrupado[prod.nombre_subcategoria] = [];
    }
    agrupado[prod.nombre_subcategoria].push(prod);
  });
  return agrupado;
};

export const materialesObraGruesa = async (req, res) => {
  try {
    const rows = await obtenerPorRango(1, 4);
    res.json(agrupar(rows));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
};

export const materialesInstalacion = async (req, res) => {
  try {
    const rows = await obtenerPorRango(5, 7);
    res.json(agrupar(rows));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
};

export const herramientas = async (req, res) => {
  try {
    const rows = await obtenerPorRango(8, 10);
    res.json(agrupar(rows));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
};

export const otrosMateriales = async (req, res) => {
  try {
    const rows = await obtenerSolo(11);
    res.json(agrupar(rows));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
};

export const registrarPedido = async (req, res) => {
  try {
    const { nit, id_producto, cantidad, total } = req.body;

    const resultado = await crearPedido(nit, id_producto, cantidad, total);

    if (!resultado) {
      return res.status(404).send("Cliente no encontrado con ese NIT");
    }

    res.status(201).send("Pedido registrado correctamente");
  } catch (error) {
    console.error("Error al registrar pedido:", error);
    res.status(500).send("Error al registrar pedido");
  }
};

export const obtenerPedidos = async (req, res) => {
  try {
    const { nit } = req.params;

    const pedidos = await obtenerPedidosPorNit(nit);

    if (!pedidos) {
      return res.status(404).send("Cliente no encontrado");
    }

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).send("Error al obtener pedidos");
  }
};

//ELIMINAR PEDIDO
export const cancelarPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;

    await cancelarPedidoPorId(id_pedido);

    res.send("Pedido cancelado correctamente");
  } catch (error) {
    console.error("Error al cancelar pedido:", error);
    res.status(500).send("Error al cancelar pedido");
  }
};
//AUTENTIFICACION/LOGUEO
export const login = async (req, res) => {
  try {
    const { id_usuario, pass } = req.body;

    const rows = await buscarUsuarioActivo(id_usuario);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado o inactivo" });
    }

    const usuario = rows[0];

    const esValida = await compararPassword(pass, usuario.contraseña);

    if (!esValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    res.json({
      mensaje: "Inicio de sesión exitoso",
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      rol: usuario.rol
    });

  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const pedidosPendientes = async (req, res) => {
  try {
    const rows = await obtenerPedidosPendientes();
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener pedidos pendientes:", error);
    res.status(500).send("Error al obtener pedidos pendientes");
  }
};

export const listarClientes = async (req, res) => {
  try {
    const rows = await obtenerTodosLosClientes();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener clientes");
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const rows = await obtenerTodosLosUsuarios();
    res.json(rows);
  } catch (error) {
    console.error("Error en GET /usuarios:", error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

//ELIMINAR USUARIO
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await eliminarUsuarioDB(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error en DELETE /usuarios:", error);
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
};

//ELIMINAR CLIENTE
export const eliminarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await eliminarClienteDB(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    res.json({ msg: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error en DELETE /clientes:", error);
    res.status(500).json({ msg: "Error al eliminar cliente" });
  }
};

export const registrarEntrega = async (req, res) => {
  const { id_pedido, id_transportista, fecha_salida, estado_entrega, ubicacion_destino } = req.body;

  try {
    await registrarEntregaDB(
      id_pedido,
      id_transportista,
      fecha_salida,
      estado_entrega,
      ubicacion_destino
    );
    await actualizarPedidoDistribucionDB(id_pedido);
    res.json({ message: "Entrega registrada y pedido actualizado correctamente." });
  } catch (error) {
    console.error("Error al registrar entrega:", error);
    res.status(500).send("Error al registrar la entrega");
  }
};

export const obtenerEntregasEnRuta = async (req, res) => {
  try {
    const rows = await obtenerEntregasEnRutaDB();
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener entregas en ruta:", error);
    res.status(500).send("Error al obtener entregas en ruta");
  }
};

export const confirmarEntrega = async (req, res) => {
  const { id } = req.params;
  try {
    const id_pedido = await confirmarEntregaDB(id);

    if (id_pedido) {
      await actualizarPedidoEntregadoDB(id_pedido);
    }

    res.json({ message: "Entrega y pedido confirmados correctamente" });
  } catch (error) {
    console.error("Error al confirmar entrega:", error);
    res.status(500).send("Error al confirmar entrega");
  }
};

/* REGISTRAR */
const validarFuerza = (pwd) => {
  let puntos = 0;

  if (pwd.length >= 8) puntos++;
  if (/[A-Z]/.test(pwd)) puntos++;
  if (/[0-9]/.test(pwd)) puntos++;
  if (/[@$!%*?&]/.test(pwd)) puntos++;

  if (puntos <= 1) return "debil";
  if (puntos === 2) return "intermedia";
  return "fuerte";
};

export const registrarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { id_usuario, nombre_usuario, correo, contraseña, rol, estado } = req.body;

  const fuerza = validarFuerza(contraseña);

  if (fuerza === "debil") {
    return res.status(400).json({ message: "La contraseña es demasiado débil" });
  }

  try {
    const hash = await bcrypt.hash(contraseña, 10);

    await registrarUsuarioDB(
      id_usuario,
      nombre_usuario,
      correo,
      hash,
      rol,
      estado
    );

    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    //console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar usuario", err });
  }
};

export const registrarCliente = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const {
      id_cliente,
      nombre_cliente,
      nit,
      direccion,
      telefono,
      correo,
      tipo_cliente,
    } = req.body;

    await registrarClienteDB(
      id_cliente,
      nombre_cliente,
      nit,
      direccion,
      telefono,
      correo,
      tipo_cliente
    );

    res.json({ msg: "Cliente registrado correctamente" });
  } catch (error) {
    //console.error("Error en POST /clientes:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
//GRAFICO ESTADISTICO
export const obtenerBalance = async (req, res) => {
  try {
    const rows = await obtenerBalanceDB();
    res.json(rows);
  } catch (error) {
    //console.error("Error en /balance:", error);
    res.status(500).json({ msg: "Error al obtener el balance" });
  }
};

/*REPORTE PDF*/
export const generarReporteEntregas = async (req, res) => {
  try {
    const rows = await obtenerEntregasReporteDB();

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte_entregas.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18).text("Reporte de Entregas", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text("ID", 40, 120);
    doc.text("Pedido", 90, 120);
    doc.text("Transp.", 160, 120);
    doc.text("Fecha Salida", 240, 120);
    doc.text("Estado", 330, 120);
    doc.text("Destino", 420, 120);

    doc.moveTo(40, 135).lineTo(550, 135).stroke();

    let y = 155;

    rows.forEach((fila) => {
      const fecha = new Date(fila.fecha_salida);
      const fechaBonita = fecha.toLocaleDateString("es-BO");

      doc.text(fila.id_entrega.toString(), 40, y);
      doc.text(fila.id_pedido.toString(), 90, y);
      doc.text(fila.id_transportista.toString(), 150, y);
      doc.text(fechaBonita, 220, y);
      doc.text(fila.estado_entrega, 320, y);
      doc.text(fila.ubicacion_destino, 400, y, { width: 150 });

      y += 25;

      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  } catch (error) {
    //console.error("Error al generar PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
};
//LOG ACCESO
export const registrarLog = async (req, res) => {
  const { id_usuario, ip, browser, evento } = req.body;
  try {
    await registrarLogDB(id_usuario, ip, browser, evento);
    res.json({ mensaje: "Log registrado" });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ mensaje: "Error al registrar log" });
  }
};
