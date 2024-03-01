import db from "../config/db.config";

export interface CartItem {
    cartId: number;
    userId: number;
    productId: number;
    quantity: number;
}

export const getInfoCartMySQL = async (userId: number) => {
    try {
        const [result] = await db.execute(
            "SELECT * FROM cart JOIN products ON cart.productId = products.productId WHERE userId = ?",
            [userId]
        );
        return result as CartItem[];
    } catch (error) {
        console.log(error);
        throw new Error("Lỗi khi lấy thông tin giỏ hàng");
    }
};
export const deleteItemCartMySql = async (userId: number, productId: number) => {
    try {
        const [result] = await db.execute(
          "delete from cart where userId = ? and productId = ?",
          [userId, productId]
        );
        return result
        
      } catch (error) {
        console.log(error);
      }
};

export const addToCartMySQL = async (userId: number, productId: number) => {
    try {
        const [result] = await db.execute(
            "SELECT * FROM cart WHERE userId = ? AND productId = ?",
            [userId, productId]
        );

        // Kiểm tra xem có bản ghi nào được tìm thấy hay không
        if ((result as any[]).length == 0) {
            const sql = `INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)`;
            const [insertResult] = await db.execute(sql, [userId, productId, 1]);
            return insertResult  
        }else{
            return null
        }
    } catch (error) {
        console.log(error);
        throw new Error("Lỗi khi thêm vào giỏ hàng");
    }
};

export const changeQuantityMySql = async (id: number, type: string) => {
  console.log("thong tin: ", id, type);
  
    const [data]:any = await db.execute(
        "select * from cart where cartId = ?",
        [id]
      );
      const [product]:any = await db.execute(
        "select * from products where productId = ?",
        [data[0].productId]
      );
      const stock = product[0].stock
      try {
        if (type == "incre") {
          if (data[0].quantity < stock) {
            const [result] = await db.execute(
              "update cart set quantity = quantity + 1 where cartId = ?",
              [id]
            );
            return result;
          } else {
            return "SL ko du"
          }
        } else {
          if (data[0].quantity > 1) {
            const [result] = await db.execute(
              "update cart set quantity = quantity - 1 where cartId = ?",
              [id]
            );
            return result;
          } else {
            return "ko the tru tiep"
          }
        }
        
      } catch (error) {
        console.log(error);
      }
};

export const deleteCartByUserId = async (userId:number) => {
    const [result] = await db.execute("delete from cart where userId = ?",[userId])
    return result
};
export const getCartbyUserIdMySQL = async (userId:number) => {
    const [result] = await db.execute("select * from cart join  products on cart.productId=products.productId where userId=?",[userId]);
    return result
};
