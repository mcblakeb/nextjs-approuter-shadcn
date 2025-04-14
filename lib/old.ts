import { createDbConnection } from "./database";
import { CardCategory, CardWord } from "./schema";

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

export { getCardWordData, insertCardCategory };
