// @ts-check
import { BaseAdapter } from './adapter.js'
import { validate } from './schema/validate.js'

/**
 * Crea un “modelo” con esquema tipado por JSDoc
 * @param {string} table
 * @param {Record<string,string>} schema
 * @param {BaseAdapter} adapter
 */
export function model(table, schema, adapter) {
  /**
   * @param {Record<string, any>} where
   * @returns {Promise<any[]>}
   */
  async function find(where = {}) {
    // Semana 3 reemplazaremos por QueryBuilder real
    // Por ahora, construimos WHERE muy simple (igualdad)
    const keys = Object.keys(where)
    const cond = keys.map((k, i) => `"${k}" = $${i+1}`).join(' AND ')
    const sql = `SELECT * FROM "${table}"${keys.length ? ` WHERE ${cond}` : ''}`
    const params = keys.map(k => where[k])
    return adapter.query(sql, params)
  }

  return {
    table,
    schema,

    /** Insert con validación runtime */
    // @ts-ignore
    async insert(data) {
      validate(schema, data)
      const cols = Object.keys(data)
      const vals = Object.values(data)
      const ph   = cols.map((_, i) => `$${i+1}`).join(', ')
      const sql  = `INSERT INTO "${table}" (${cols.map(c=>`"${c}"`).join(', ')}) VALUES (${ph}) RETURNING *`
      const rows = await adapter.query(sql, vals)
      return rows[0]
    },

    /** Update simple por igualdad en where */
    // @ts-ignore
    async update(where, data) {
      validate(schema, data)
      const setCols = Object.keys(data)
      const setSql  = setCols.map((c,i)=>`"${c}" = $${i+1}`).join(', ')
      const setVals = Object.values(data)

      const whereKeys = Object.keys(where)
      const whereSql  = whereKeys.map((k,i)=>`"${k}" = $${setVals.length + i + 1}`).join(' AND ')
      const whereVals = whereKeys.map(k=> where[k])

      const sql = `UPDATE "${table}" SET ${setSql}${whereKeys.length ? ` WHERE ${whereSql}` : ''} RETURNING *`
      const rows = await adapter.query(sql, [...setVals, ...whereVals])
      return rows
    },

    /** Delete simple */
    // @ts-ignore
    async remove(where) {
      const keys = Object.keys(where)
      const whereSql = keys.map((k,i)=>`"${k}" = $${i+1}`).join(' AND ')
      const params = keys.map(k=> where[k])
      const sql = `DELETE FROM "${table}"${keys.length ? ` WHERE ${whereSql}` : ''} RETURNING *`
      const rows = await adapter.query(sql, params)
      return rows
    },

    /** Find simple (all/where) — reemplazaremos por QueryBuilder en Semana 3 */
    find,
    all: () => find({})
  }
}
