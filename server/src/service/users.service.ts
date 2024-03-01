import db from '../config/db.config'
export const getAllUsersMySQL = async()=>{
    const [users] = await db.execute("select * from users where role = ?",[0])
    return users;
}
export const changeStatusUserMySQL = async(id:number,status:number)=>{
    const [users] = await db.execute("update users set status = ? where  userId =?",[status,id])
    return users;
}