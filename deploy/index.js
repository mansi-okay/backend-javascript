require('dotenv').config()

const express = require('express')
// import express from "express"

const app = express()

// server will listen for requests on port 3000 
// A port is like a door number on computer
// const port = 4000

app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/reddit', (req, res) => {
    res.send("beleuesees")
})

app.get('/login', (req,res) => {
    res.send('<h1> please login here </h1>')
})

app.get('/user', (req,res) => {
    res.send('<h2> YOUR PROFILE <h2>')
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})