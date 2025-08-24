// @ts-check

/**
 * Adaptador base: cualquier DB debe implementar query() y transaction()
 */
export class BaseAdapter {
  /**
   * @param {string} sql
   * @param {any[]} [params]
   * @returns {Promise<any[]>}
   */
  async query(sql, params = []) {
    throw new Error('BaseAdapter.query() no implementado')
  }

  /**
   * Transacción: BEGIN → work() → COMMIT / ROLLBACK
   * @template T
   * @param {() => Promise<T>} work
   * @returns {Promise<T>}
   */
  async transaction(work) {
    throw new Error('BaseAdapter.transaction() no implementado')
  }
}
