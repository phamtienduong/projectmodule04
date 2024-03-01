import db from "../config/db.config";
export const getCategoriesMySQL = async () => {
  const [categories] = await db.execute("select * from  category");
  return categories;
};
export const addCategoriesMySQL = async (nameCategory: string) => {
  const [categories] = await db.execute(
    "insert into category (nameCategory) values (?) ",
    [nameCategory]
  );
  return categories;
};
export const updateCategoriesMySQL = async (
  categoryId: number,
  nameCategory: string
) => {
  const [categories] = await db.execute(
    "update category set nameCategory = ? where categoryId = ? ",
    [nameCategory, categoryId]
  );
  return categories;
};
export const deleteCategoriesMySQL = async (
  categoryId: number
) => {
  const [categories] = await db.execute(
    "delete from category where categoryId = ? ",
    [categoryId]
  );
  return categories;
};
