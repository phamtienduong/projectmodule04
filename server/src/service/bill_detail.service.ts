import db from "../config/db.config"

export const creatBillDetailMySql = async(billId: number, productId: number, quantity: number)=>{
    const [result] = await db.execute(
        "INSERT INTO bill_detail (billId, quantity, productId) VALUES (?, ?, ?)",
        [billId, quantity, productId]
      );
      return result;
}
export const getProductInBillMySql = async(billId: number)=>{
    const [result] = await db.execute(
        "SELECT * FROM bill JOIN bill_detail ON bill.bilId = bill_detail.billId JOIN products ON bill_detail.productId = products.productId WHERE bill.bilId = ?",
        [billId]
      );
      return result;
}