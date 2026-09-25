import * as migration_20260922_225512_inicial from './20260922_225512_inicial';
import * as migration_20260923_213411_fase2_cifras_clientes_preguntas_textos from './20260923_213411_fase2_cifras_clientes_preguntas_textos';
import * as migration_20260924_003706_fase3_material from './20260924_003706_fase3_material';
import * as migration_20260924_153600_fase4_borradores_proyectos from './20260924_153600_fase4_borradores_proyectos';
import * as migration_20260924_155705_fase4bis_etapas_fotos from './20260924_155705_fase4bis_etapas_fotos';
import * as migration_20260924_222423_fase15_categorias_cine_marca from './20260924_222423_fase15_categorias_cine_marca';
import * as migration_20260925_033651_fase17_meta_descripcion_proyectos from './20260925_033651_fase17_meta_descripcion_proyectos';

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
    name: '20260924_003706_fase3_material',
  },
  {
    up: migration_20260924_153600_fase4_borradores_proyectos.up,
    down: migration_20260924_153600_fase4_borradores_proyectos.down,
    name: '20260924_153600_fase4_borradores_proyectos',
  },
  {
    up: migration_20260924_155705_fase4bis_etapas_fotos.up,
    down: migration_20260924_155705_fase4bis_etapas_fotos.down,
    name: '20260924_155705_fase4bis_etapas_fotos',
  },
  {
    up: migration_20260924_222423_fase15_categorias_cine_marca.up,
    down: migration_20260924_222423_fase15_categorias_cine_marca.down,
    name: '20260924_222423_fase15_categorias_cine_marca',
  },
  {
    up: migration_20260925_033651_fase17_meta_descripcion_proyectos.up,
    down: migration_20260925_033651_fase17_meta_descripcion_proyectos.down,
    name: '20260925_033651_fase17_meta_descripcion_proyectos'
  },
];
