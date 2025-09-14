// @ts-check
import { BaseAdapter } from './adapter.js'
import { validate } from './schema/validate.js'
import { QueryBuilder } from "./query-builder.js"


export function model(table, schema, adapter) {
  async function find(where = {}) {
    const keys = Object.keys(where)
    const cond = keys.map((k, i) => `"${k}" = $${i+1}`).join(' AND ')
    const sql = `SELECT * FROM "${table}"${keys.length ? ` WHERE ${cond}` : ''}`
    const params = keys.map(k => where[k])
    return adapter.query(sql, params)
  }

  return {
    table,
    schema,

    async insert(data) {
      validate(schema, data, { mode: 'insert' });
      const cols = Object.keys(data);
      const vals = Object.values(data);

      if (adapter.flavor === "mysql") {
        // 👇 versión MySQL
        const placeholders = cols.map(() => `?`).join(", ");
        const sql = `INSERT INTO \`${table}\` (${cols.map(c => `\`${c}\``).join(", ")}) VALUES (${placeholders})`;
        const result = await adapter.query(sql, vals);
        return { id: result.insertId, ...data };
      } else {
        // 👇 versión SQLite/Postgres
        const ph = cols.map((_, i) => `$${i+1}`).join(', ');
        const sql = `INSERT INTO "${table}" (${cols.map(c=>`"${c}"`).join(', ')}) VALUES (${ph}) RETURNING *`;
        const rows = await adapter.query(sql, vals);
        return rows[0];
      }
    },

    async update(where, data) {
      validate(schema, data, { mode: 'update' });
      const setCols = Object.keys(data);
      const setVals = Object.values(data);

      if (adapter.flavor === "mysql") {
        const setSql = setCols.map((c) => `\`${c}\` = ?`).join(", ");
        const whereKeys = Object.keys(where);
        const whereSql = whereKeys.map((k)=> `\`${k}\` = ?`).join(" AND ");
        const whereVals = whereKeys.map((k)=> where[k]);

        const sql = `UPDATE \`${table}\` SET ${setSql}${whereSql ? ` WHERE ${whereSql}` : ""}`;
        const result = await adapter.query(sql, [...setVals, ...whereVals]);
        return result; // MySQL no devuelve rows aquí
      } else {
        const setSql = setCols.map((c,i)=>`"${c}" = $${i+1}`).join(', ');
        const whereKeys = Object.keys(where);
        const whereSql  = whereKeys.map((k,i)=>`"${k}" = $${setVals.length + i + 1}`).join(' AND ');
        const whereVals = whereKeys.map((k)=> where[k]);

        const sql = `UPDATE "${table}" SET ${setSql}${whereKeys.length ? ` WHERE ${whereSql}` : ''} RETURNING *`;
        const rows = await adapter.query(sql, [...setVals, ...whereVals]);
        return rows;
      }
    },

    async remove(where) {
      const keys = Object.keys(where)
      const whereSql = keys.map((k,i)=>`"${k}" = $${i+1}`).join(' AND ')
      const params = keys.map(k=> where[k])
      const sql = `DELETE FROM "${table}"${keys.length ? ` WHERE ${whereSql}` : ''} RETURNING *`
      const rows = await adapter.query(sql, params)
      return rows
    },

    find,
    all: () => find({}),

    
    qb() {
      return new QueryBuilder(table, adapter)
    }
  }
}
