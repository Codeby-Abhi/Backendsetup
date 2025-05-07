import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


// require('dotenv').config({path: './env'})
// import dotenv from "dotenv"
// import connectDB from "./db/index.js";
// import {app} from './app.js'

// dotenv.config({
//     path: '.env'
// })

// const port = process.env.PORT || 3000;

// connectDB()
// .then(()=>{
//     app.on("error", (error)=>{
//         console.log("error accured :",error)
//         throw error
//     })
//     app.listen(port || 3000, ()=>{
//         console.log(`server is running at : ${port}`)
//     })
// })
// .catch((error)=>{
//     console.log("DB connection error ",error)
// })





/*
//one of the approch to get connection
import express from "express";
const app = express();

//iffy statement to call function of db connection on execution of index.js
//; written just for cleaning purpose sometime ; is missing on previous line which create error     
;(async () => {
    //using try/catch and async/await is proffesional approch 
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error :", error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`app is running on ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("Error :", error)
    } 
})()
*/

