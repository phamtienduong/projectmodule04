import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { rootRouter } from "./src/router/root.routes"
import dotenv from "dotenv" 
dotenv.config()
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
rootRouter(app)
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 7800");
})
