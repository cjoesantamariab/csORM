// @ts-check
import sqlite3 from "sqlite3";
import { SQLiteAdapter } from "../src/sqlite-adapter.js";
import { model } from "../src/index.js";

const db = new sqlite3.Database("csorm.db");
const adapter = new SQLiteAdapter(db);

const User = model("users", {
  id: "number",
  email: "string",
  is_active: "boolean"
}, adapter);

db.serialize(async () => {
  await adapter.query(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT,
    is_active BOOLEAN
  )`);

  await User.insert({ id: 1, email: "alice@gmail.com", is_active: true });
  await User.insert({ id: 2, email: "bob@yahoo.com", is_active: false });
  await User.insert({ id: 3, email: "charlie@gmail.com", is_active: true });

  const results = await User
    .qb()
    .select(["id", "email"])
    .where({ is_active: 1 })
    .orderBy("id", "DESC")
    .limit(2)
    .all();

  console.log("Resultados QueryBuilder:", results);
});
