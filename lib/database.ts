import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { CardCategory, CardWord } from "./schema";

const createDbConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQLPASSWORD,
    port: 22787,
  });

  return drizzle({ client: connection });
};

const getCardWordData = async () => {
  const db = await createDbConnection();
  const data = await db.select().from(CardWord).execute();
  return data;
};

const insertCardCategory = async (
  categoryName: string,
  categoryDesc: string
) => {
  const db = await createDbConnection();
  await db
    .insert(CardCategory)
    .values({ categoryName, categoryDesc })
    .execute();
};

export { getCardWordData, insertCardCategory, createDbConnection };
