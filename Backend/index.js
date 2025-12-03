import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import PDFDocument from "pdfkit";
import fs from "fs";

import productoRutas from "./rutas/productoRutas.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", productoRutas);

app.listen(3000, () => {
  console.log("Servidor backend corriendo en http://localhost:3000");
});
