import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();

app.get('/', (res,req)=>{
    res.send("Server Ready")
})

const users = [
  {
    id: 1,
    name: "User One",
    email: "user1@example.com",
  },
  {
    id: 2,
    name: "User Two",
    email: "user2@example.com",
  },
  {
    id: 3,
    name: "User Three",
    email: "user3@example.com",
  },
  {
    id: 4,
    name: "User Four",
    email: "user4@example.com",
  },
  {
    id: 5,
    name: "User Five",
    email: "user5@example.com",
  },
];


app.get('/api/users', (req, res) => {
    res.send(users)
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server at https://localhost:${port}`);   
})