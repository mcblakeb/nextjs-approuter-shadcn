import { Config, defineConfig } from 'drizzle-kit';


const dbCredentials = {
  host: process.env.MYSQLHOST || '',
  user: process.env.MYSQLUSER || '',
  database: process.env.MYSQL_DATABASE || '',
  password: process.env.MYSQLPASSWORD || '',
  port: 22787,
};



export default defineConfig({
  dialect: 'mysql',
  schema: './lib/schema.ts',
  out: './drizzle',
  dbCredentials: dbCredentials,
}) satisfies Config;
