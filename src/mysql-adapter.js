// @ts-check
import mysql from "mysql2/promise";

export class MySQLAdapter {
  /**
   * @param {mysql.Connection} conn
   */
  constructor(conn) {
    this.conn = conn;
    this.flavor = "mysql";
  }

  /**
   * Ejecuta un query
   * @param {string} sql
   * @param {any[]} [params]
   */
  async query(sql, params = []) {
    const [rows] = await this.conn.execute(sql, params);
    return rows;
  }
}
