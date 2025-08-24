# csORM
MIT License

Copyright (c) 2025 Cristian ...

Permission is hereby granted, free of charge, to any person obtaining a copy...
(usa tu nombre y año; puedes copiar el texto MIT completo)



*(luego lo expandimos en la Semana 6)*

---

## 7) `package.json` (scripts y metadatos)
Abre `package.json` y ajusta:

```json
{
  "name": "@cjoesb/csorm",
  "version": "0.0.1",
  "description": "Mini ORM educativo para Node.js con JSDoc y validación runtime",
  "type": "module",
  "main": "src/index.js",
  "exports": {
    ".": {
      "import": "./src/index.js"
    }
  },
  "keywords": ["orm", "node", "sqlite", "educational", "jsdoc"],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjoesantamariab/csorm.git"
  },
  "bugs": { "url": "https://github.com/cjoesantamariab/csorm/issues" },
  "homepage": "https://github.com/cjoesantamariab/csorm#readme",
  "scripts": {
    "test": "node --test || echo \"Node 20 recomendado para node:test\"",
    "lint": "echo \"(opcional) agrega eslint más adelante\"",
    "build": "echo \"JS puro: sin build por ahora\"",
    "prepublishOnly": "npm test"
  },
  "engines": { "node": ">=18" }
}
