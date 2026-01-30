require('dotenv').config()

const express = require('express')
// import express from "express"

const app = express()

// server will listen for requests on port 3000 
// A port is like a door number on computer
// const port = 4000

const githubData = {
  "login": "mansi-okay",
  "id": 193275684,
  "node_id": "U_kgDOC4UnJA",
  "avatar_url": "https://avatars.githubusercontent.com/u/193275684?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/mansi-okay",
  "html_url": "https://github.com/mansi-okay",
  "followers_url": "https://api.github.com/users/mansi-okay/followers",
  "following_url": "https://api.github.com/users/mansi-okay/following{/other_user}",
  "gists_url": "https://api.github.com/users/mansi-okay/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/mansi-okay/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/mansi-okay/subscriptions",
  "organizations_url": "https://api.github.com/users/mansi-okay/orgs",
  "repos_url": "https://api.github.com/users/mansi-okay/repos",
  "events_url": "https://api.github.com/users/mansi-okay/events{/privacy}",
  "received_events_url": "https://api.github.com/users/mansi-okay/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "Mansi Agrawat",
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 4,
  "public_gists": 0,
  "followers": 1,
  "following": 1,
  "created_at": "2024-12-30T20:09:52Z",
  "updated_at": "2026-01-16T14:12:05Z"
}

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

app.get('/github', (req,res) => {
    res.json(githubData)
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})