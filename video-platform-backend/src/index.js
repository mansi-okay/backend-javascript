// overrode DNS resolution inside the Node.js runtime using dns/promises.setServers()
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);
// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});
import connectDB from "./db/index.js";
import { app } from "./app.js";


connectDB()
.then((response) => {

    app.listen(process.env.PORT || 8000, () => {
        // .listen starts the express server
        console.log(`Epress server started and it's running on port: ${process.env.PORT}`);  
    })

})
.catch((error) => {
    console.log("MongoDB connection failed: ", error);   
})












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