import * as migration_20260922_225512_inicial from './20260922_225512_inicial';
import * as migration_20260923_213411_fase2_cifras_clientes_preguntas_textos from './20260923_213411_fase2_cifras_clientes_preguntas_textos';
import * as migration_20260924_003706_fase3_material from './20260924_003706_fase3_material';

export const migrations = [
  {
    up: migration_20260922_225512_inicial.up,
    down: migration_20260922_225512_inicial.down,
    name: '20260922_225512_inicial',
  },
  {
    up: migration_20260923_213411_fase2_cifras_clientes_preguntas_textos.up,
    down: migration_20260923_213411_fase2_cifras_clientes_preguntas_textos.down,
    name: '20260923_213411_fase2_cifras_clientes_preguntas_textos',
  },
  {
    up: migration_20260924_003706_fase3_material.up,
    down: migration_20260924_003706_fase3_material.down,
    name: '20260924_003706_fase3_material'
  },
];
