// @ts-check
import sqlite3 from "sqlite3";
import { BaseAdapter } from "./adapter.js";

export class SQLiteAdapter extends BaseAdapter {
  /**
   * @param {sqlite3.Database} db
   */
  constructor(db) {
    super();
    this.db = db;
  }

  /**
   * Ejecuta una consulta y devuelve las filas
   * @param {string} sql
   * @param {any[]} [params]
   * @returns {Promise<any[]>}
   */
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  /**
   * Maneja transacciones básicas
   * @param {() => Promise<any>} work
   */
  async transaction(work) {
    await this.query("BEGIN");
    try {
      const result = await work();
      await this.query("COMMIT");
      return result;
    } catch (err) {
      await this.query("ROLLBACK");
      throw err;
    }
  }
}
