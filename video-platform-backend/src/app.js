import express from "express"
import cors from "cors"
import cookieparser from"cookie-parser"

const app = express();

// .use() whenever we are using a midleware 
// it is used to configure the server

// Configurations 

// handling cors
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,  // lets the browser send cookies to the backend      
}
))

// server knows it’s allowed to accept & read JSON when request comes in
app.use(express.json({limit: "16kb"}))

// server knows it’s allowed to accept & read form data(HTML form or Postman)
app.use(express.urlencoded(
    {   limit: "16kb",
        extended:true   // allows nested objects in form data
    }))

// server knows it’s allowed to hand out files from "public" folder 
app.use(express.static("public"))

// browser can store & send cookies and server can read cookies
app.use(cookieparser())     // bug fix: previous-> app.use(cookieparser) 

// Import routes
import userRouter from "./routes/user.routes.js"

// routes declare
app.use("/api/v1/users",userRouter)   //bug fix: previous -> app.use("api/v1/users",userRouter)
// http://localhost:8000/api/v1/users/register 

export { app }