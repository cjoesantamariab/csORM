// @ts-check
import mysql from "mysql2/promise";
import { MySQLAdapter } from "../src/mysql-adapter.js";
import { model } from "../src/index.js";


async function main() {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "csorm_user",
    password: "csorm_pass",
    database: "csorm_demo"
  });

  const adapter = new MySQLAdapter(conn);

//   await adapter.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INT PRIMARY KEY AUTO_INCREMENT,
//       email VARCHAR(255),
//       is_active BOOLEAN
//     )
//   `);

  const User = model("users", {
    id: "number?",
    email: "string",
    is_active: "boolean"
  }, adapter);

//   const u1 = await User.insert({ email: "cjoe@example.com", is_active: true });
//   console.log("Insertado:", u1);

  const results1 = await User
    .qb()
    .select(["id", "email"])
    .orderBy("id", "DESC")
    .limit(5)
    .all();

  console.log("Resultados MySQL QB:", results1);

  const results2 = await User
    .qb()
    .select(["id", "email", "is_active"])
    .where({ is_active: true })
    .orderBy("id", "ASC")
    .limit(5)
    .all();
  
  console.log("Resultados MySQL QB:", results2);

  await conn.end();
}

main().catch(console.error);
