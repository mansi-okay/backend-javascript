// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});
import connectDB from "./db/index.js";


connectDB()


/*
import express from "express";
const app = express();
(async ()=>{
    try {
        // tries connection to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        
        // .on listens for Express app-level errors after db connection
        app.on("error", (error) => {
            console.log("Express app error occurred after DB connection");
            throw error
        })

        //starts express server only after db connection suceeeds
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on PORT: ${process.env.PORT}`); 
        })
        
    } catch (error) {
        console.log("ERROR: ", error);
        throw error;
        // this block runs when db connected completely fails
        // or when any awaited task in try throws an error
    }
})()
*/