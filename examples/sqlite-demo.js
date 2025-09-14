import sqlite3 from "sqlite3";
import { SQLiteAdapter } from "../src/sqlite-adapter.js";
import { model } from "../src/index.js";

// Crear DB en memoria
const db = new sqlite3.Database(":memory:");
const adapter = new SQLiteAdapter(db);

db.serialize(async () => {
  // Crear tabla
  await adapter.query(`CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT,
    is_active BOOLEAN
  )`);

  // Crear modelo
  const User = model("users", {
    id: "number",
    email: "string",
    is_active: "boolean",
  }, adapter);

  // Insertar
  const u1 = await User.insert({ id: 1, email: "cjoe@example.com", is_active: true });
  console.log("Insertado:", u1);

  // Consultar
  const found = await User.find({ email: "cjoe@example.com" });
  console.log("Encontrado:", found);

  // Actualizar
  const updated = await User.update({ id: 1 }, { email: "nuevo@example.com" });
  console.log("Actualizado:", updated);

  // Eliminar
  const removed = await User.remove({ id: 1 });
  console.log("Eliminado:", removed);
});

