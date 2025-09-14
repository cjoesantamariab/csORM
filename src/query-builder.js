// @ts-check

/**
 * QueryBuilder básico
 */
export class QueryBuilder {
  /**
   * @param {string} table
   * @param {{ query(sql:string, params?:any[]):Promise<any[]>, flavor?: string }} adapter
   */
  constructor(table, adapter) {
    this.table = table;
    this.adapter = adapter;
    this._select = "*";
    this._where = [];
    this._orderBy = "";
    this._limit = "";
    this._params = [];

    // por defecto sqlite, pero si el adapter tiene flavor= "mysql", lo tomamos
    this.flavor = adapter.flavor || "sqlite";
  }

  quote(identifier) {
    return this.flavor === "mysql" ? `\`${identifier}\`` : `"${identifier}"`;
  }

  select(cols) {
    this._select = Array.isArray(cols)
      ? cols.map(c => this.quote(c)).join(", ")
      : cols;
    return this;
  }

  where(cond, params = []) {
    if (typeof cond === "object") {
      for (const [k, v] of Object.entries(cond)) {
        this._where.push(`${this.quote(k)} = ?`);
        this._params.push(v);
      }
    } else {
      this._where.push(cond);
      this._params.push(...params);
    }
    return this;
  }

  orderBy(col, dir = "ASC") {
    this._orderBy = `ORDER BY ${this.quote(col)} ${dir}`;
    return this;
  }

  limit(n) {
    this._limit = `LIMIT ${n}`;
    return this;
  }

  async all() {
    let sql = `SELECT ${this._select} FROM ${this.quote(this.table)}`;
    if (this._where.length) sql += " WHERE " + this._where.join(" AND ");
    if (this._orderBy) sql += " " + this._orderBy;
    if (this._limit) sql += " " + this._limit;
    return this.adapter.query(sql, this._params);
  }
}
