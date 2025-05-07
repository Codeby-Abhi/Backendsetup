import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

//connfiguring cors, can also do further custmization with {}
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


//middelwear handle incoming json data with limit of 16kb
app.use(express.json({limit: "16kb"}))
//middlewear handle incoming request with urlencoded ex.form submission 
app.use(express.urlencoded({extended:true , limit:"16kb"}))
//store assets like image or favicon etc in local storage 
app.use(express.static("public"))  
//can access and set cookies of user from server, only server can perfrom CRUD on it 
app.use(cookieParser())

//routes import
import userRoutes from "./routes/user.routes.js"

//routes declaration
//will use app.use because router is saperated from app either we can use app.get or app.post etc
app.use("/api/v1/users", userRoutes)


export { app }