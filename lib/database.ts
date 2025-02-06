import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { mysqlTable, serial, text, int } from "drizzle-orm/mysql-core";

export const testTable = mysqlTable("TestTable", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

const createDbConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQLPASSWORD,
    port: 22787,
  });

  //   const connection = await mysql.createConnection({
  //     host: "autorack.proxy.rlwy.net",
  //     user: "root",
  //     password: "HqKtSxAVFxdfLxCCEqNVbUqaQSzCSQRF",
  //     database: "railway",
  //     port: 22787,
  //   });

  return drizzle({ client: connection });
};

const getData = async () => {
  const db = await createDbConnection();
  const data = await db.select().from(testTable).execute();
  return data;
};

export { getData };
