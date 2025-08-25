// @ts-check

/**
 * Validador runtime simple
 * @param {Record<string,string>} schema - ej: { id:'number', email:'string?', created_at:'date' }
 * @param {Record<string,any>} data
 */
export function validate(schema, data) {
  for (const k of Object.keys(data)) {
    if (!(k in schema)) throw new Error(`Campo desconocido: ${k}`)
  }
  for (const [k, rule] of Object.entries(schema)) {
    const optional = rule.endsWith('?')
    const base = optional ? rule.slice(0, -1) : rule
    const v = data[k]

    if (v == null) {
      if (!optional) throw new Error(`'${k}' es requerido`)
      continue
    }

    switch (base) {
      case 'string': if (typeof v !== 'string') throw new Error(`'${k}' debe ser string`); break
      case 'number': if (typeof v !== 'number') throw new Error(`'${k}' debe ser number`); break
      case 'boolean': if (typeof v !== 'boolean') throw new Error(`'${k}' debe ser boolean`); break
      case 'bigint': if (typeof v !== 'bigint') throw new Error(`'${k}' debe ser bigint`); break
      case 'date': if (!(v instanceof Date)) throw new Error(`'${k}' debe ser Date`); break
      case 'object': if (typeof v !== 'object' || Array.isArray(v)) throw new Error(`'${k}' debe ser object`); break
      case 'buffer':
        // @ts-ignore
        if (!(v instanceof Uint8Array) && !(globalThis.Buffer && v instanceof Buffer))
          throw new Error(`'${k}' debe ser Buffer/Uint8Array`)
        break
      default: throw new Error(`Tipo no soportado en schema: ${rule}`)
    }
  }
}
