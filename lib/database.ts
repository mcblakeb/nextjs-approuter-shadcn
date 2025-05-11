'use server';

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import {
  retroNoteRelations,
  retroNotes,
  retroRelations,
  retros,
  userRelations,
  users,
  usersToRetros,
  usersToRetrosRelations,
} from './schema';

const createDbConnection = async () => {
  const schema = {
    retros,
    retroNotes,
    retroRelations,
    retroNoteRelations,
    users,
    usersToRetros,
    usersToRetrosRelations,
    userRelations,
  };
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQLPASSWORD,
    port: 22787,
  });

  return drizzle(connection, { schema, mode: 'default' });
};

export { createDbConnection };
