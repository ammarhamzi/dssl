// Import dotenv to load environment variables
import { config } from 'dotenv';
config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexConfig = {
  development: {
    client: process.env.VITE_DB_CLIENT || 'pg',
    connection: {
      host: process.env.VITE_DB_HOST || 'localhost',
      port: Number(process.env.VITE_DB_PORT) || 5432,
      user: process.env.VITE_DB_USER || 'postgres',
      password: process.env.VITE_DB_PASSWORD || 'postgres', 
      database: process.env.VITE_DB_NAME || 'jboilerplate_dev',
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  staging: {
    client: process.env.VITE_DB_CLIENT || 'pg',
    connection: {
      host: process.env.VITE_DB_HOST,
      port: Number(process.env.VITE_DB_PORT) || 5432,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME || 'jboilerplate_staging',
      ssl: process.env.VITE_DB_SSL === 'true' ? true : undefined,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: process.env.VITE_DB_CLIENT || 'pg',
    connection: {
      host: process.env.VITE_DB_HOST,
      port: Number(process.env.VITE_DB_PORT) || 5432,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME || 'jboilerplate_prod',
      ssl: process.env.VITE_DB_SSL === 'true' ? true : undefined,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default knexConfig; 