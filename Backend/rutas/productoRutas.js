import { Router } from "express";
import { body } from "express-validator";

import {
  materialesObraGruesa,
  materialesInstalacion,
  herramientas,
  otrosMateriales,

  registrarPedido,
  obtenerPedidos,
  cancelarPedido,

  login,
  pedidosPendientes,
  listarClientes,
  listarUsuarios,

  eliminarUsuario,
  eliminarCliente,
  registrarEntrega,
  obtenerEntregasEnRuta,
  confirmarEntrega,

  registrarUsuario,
  registrarCliente,

  obtenerBalance,
  generarReporteEntregas,
  registrarLog
} from "../controladores/productoControlador.js";

const router = Router();

router.get("/materialesDeObraGruesa", materialesObraGruesa);
router.get("/materialesDeInstalacionyAcabado", materialesInstalacion);
router.get("/herramientasyEquipos", herramientas);
router.get("/otros", otrosMateriales);


router.post("/pedidos", registrarPedido);
router.get("/pedidos/:nit", obtenerPedidos);
//ELIMINAR PEDIDO
router.put("/pedidos/cancelar/:id_pedido", cancelarPedido);

//AUTENTIFICACION/LOGUEO
router.post("/login", login);
router.get("/pedido/pendiente", pedidosPendientes);
router.get("/clientes", listarClientes);
router.get("/usuarios", listarUsuarios);

//ELIMINAR USUARIO
router.delete("/usuarios/:id", eliminarUsuario);
//ELIMINAR CLIENTE
router.delete("/clientes/:id", eliminarCliente);

router.post("/entregas", registrarEntrega);
router.get("/entregas/en_ruta", obtenerEntregasEnRuta);
router.put("/entregas/:id/confirmar", confirmarEntrega);

/*REGISTRAR USUARIO*/
router.post(
  "/registrar",
  [
    body("id_usuario").notEmpty().withMessage("El ID es obligatorio"),
    body("nombre_usuario").notEmpty().withMessage("El nombre es obligatorio"),
    body("correo").isEmail().withMessage("Correo inválido"),
    body("contraseña")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener mínimo 8 caracteres"),
    body("rol").notEmpty().withMessage("El rol es obligatorio"),
  ],
  registrarUsuario
);

/* REGISTRAR CLIENTE */
router.post(
  "/clientes",
  [
    body("id_cliente")
      .notEmpty().withMessage("El ID del cliente es obligatorio")
      .isNumeric().withMessage("El ID del cliente debe ser numérico"),

    body("nombre_cliente").notEmpty().withMessage("El nombre es obligatorio"),

    body("nit")
      .notEmpty().withMessage("El NIT es obligatorio")
      .isNumeric().withMessage("El NIT debe ser numérico"),

    body("direccion").notEmpty().withMessage("La dirección es obligatoria"),

    body("telefono")
      .notEmpty().withMessage("El teléfono es obligatorio")
      .isNumeric().withMessage("El teléfono debe ser numérico"),

    body("correo")
      .notEmpty().withMessage("El correo es obligatorio")
      .isEmail().withMessage("Correo inválido"),

    body("tipo_cliente")
      .notEmpty().withMessage("El tipo de cliente es obligatorio")
      .isIn(["empresa", "constructora", "particular"])
      .withMessage("Tipo cliente inválido"),
  ],
  registrarCliente
);
//GRAFICO ESTADISTICO
router.get("/balance", obtenerBalance);
//REPORTE PDF
router.get("/reporte-entregas", generarReporteEntregas);
//LOG ACCESO
router.post("/logs", registrarLog);

export default router;