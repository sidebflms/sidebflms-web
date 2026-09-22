import * as migration_20260922_225512_inicial from './20260922_225512_inicial';

export const migrations = [
  {
    up: migration_20260922_225512_inicial.up,
    down: migration_20260922_225512_inicial.down,
    name: '20260922_225512_inicial'
  },
];
