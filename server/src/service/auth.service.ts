import db from "../config/db.config"
export const addUser = async (userName:string,email:string,phone:number,password:string)=>{
    try {
        const [users] = await db.execute("insert into users (userName,email,phone,password) values (?,?,?,?)",[userName,email,phone,password])
        return users
    } catch (error) {
        console.log(error);
    }  
}
export const getUserByEmail = async(email:string)=>{
    try {
        const [users]:any = await db.execute("select * from users where email=?",[email])  
        return users[0]
    } catch (error) {
        console.log(error);
    }
}