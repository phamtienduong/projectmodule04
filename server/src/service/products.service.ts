import db from "../config/db.config";
export const getAllProductMySQL = async () => {
  const [products] = await db.execute("select * from products");
  return products;
};
export const getProductByIdMySQL = async (id: number) => {
  const [products]: any = await db.execute(
    "select * from products where productId = ?",
    [id]
  );
  return products[0];
};
export const addProductMySQL = async (
  nameProduct: string,
  image: string,
  price: number,
  description: string,
  stock: number,
  categoryId: number
) => {
  const [products] = await db.execute(
    "insert into products (nameProduct,image,price,description,stock,categoryId) values (?,?,?,?,?,?)",
    [nameProduct, image, price, description, stock, categoryId]
  );
  return products;
};
export const updateProductMySQL = async (
  nameProduct: string,
  image: string,
  price: number,
  description: string,
  stock: number,
  categoryId: number,
  productId: number
) => {
  const [products] = await db.execute(
    "update products set nameProduct = ?, image = ?, price = ?, description = ?,  stock=?, categoryId = ? where productId = ?",[
      nameProduct, image, price, description, stock, categoryId, productId]
  );
  return products 
};
export const deleteProductMySQL = async(id:number)=>{
  const [products] = await db.execute("delete from products where productId=?",[id])
  return products
}
export const getProductByCategoryIdMySQL = async (id:number)=>{
  const [products]= await db.execute("select * from products where categoryId = ?",[id])
  return products
}
export const updateOutStockProductMySQL =  async (productId:number) =>{
  const [result] = await db.execute(
    "update products set stock = ? where productId = ?",
    [0, productId]
  );
  return result
}
export const getProductsByName =  async (nameProduct:string) =>{
    const [result] = await db.execute(
      `select * from products where nameProduct like '%${nameProduct}%'`
    );
    return result;
}
