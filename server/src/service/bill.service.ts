import db from "../config/db.config";
export const getAllIdBill = async () => {
  const [bill] = await db.execute(`select * from bill`);
  return bill;
};
export const getBillsForAdminMySql = async (id: number) => {
  const [bill] = await db.execute(
    `SELECT * FROM bill join bill_detail on bill.bilId = bill_detail.billId join products on bill_detail.productId = products.productId where bill.bilId = ?`,
    [id]
  );
  return bill;
};
export const getBillsForUserMySql = async (id: number) => {
  const [bill] = await db.execute(
    `SELECT * FROM bill join bill_detail on bill.bilId = bill_detail.billId join products on bill_detail.productId = products.productId where bill.userId = ?`,
    [id]
  );
  return bill;
};
export const creatBillMySql = async (
  userId: number,
  phoneNumber: number,
  address: string,
  totalPrice: number
) => {
  // console.log(phoneNumber, totalPrice);
  
  const [bill] = await db.execute(
    "insert into bill (userId,phoneNumber,address,totalPrice,createdAt) values (?,?,?,?,CURRENT_TIMESTAMP())",
    [userId, phoneNumber, address, totalPrice]
  );
  return bill;
};
export const getBillsMySql = async (
  id:number
) => {
  const [bill] = await db.execute(
    `SELECT * FROM bill join bill_detail on bill.bilId = bill_detail.billId join products on bill_detail.productId = products.productId where bill.bilId = ?`,
    [id]
  );
  return bill;
};
export const adminDenyMySql = async (
    bilId:number
) => {
  const [bill] = await db.execute(
    `update bill set status = "admin da huy" where bilId = ?`,
    [bilId]
  );
  return bill;
};
export const userDenyMySql = async (
    bilId:number
) => {
  const [bill] = await db.execute(
    `update bill set status = "user da huy" where bilId = ?`,
    [bilId]
  );
  return bill;
};
export const adminAcceptMySql = async (
    bilId:number
) => {
    const [result]:any = await db.execute(
        `SELECT * FROM bill join bill_detail on bill.bilId = bill_detail.billId where bill.bilId = ?`,
        [bilId]
      );
      for (let i = 0; i < result.length; i++) {
        const productId = result[i].productId;
        const quantity = result[i].quantity;
        await db.execute(
          `update products set stock = stock - ? where productId = ?`,
          [quantity, productId]
        );
      }
  
      const [resultUpdate] = await db.execute(
        `update bill set status = "da xac nhan" where bilId = ?`,
        [bilId]
      );
      return resultUpdate;
};
