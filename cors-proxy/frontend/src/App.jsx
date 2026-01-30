import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import { useEffect } from 'react'

function App() {

  // [users, setUsers] -> array destructuring

  // useState([]) -> Creates a state variable
  //              -> empty array initially cuz planning to store list, API data, etc

  const [users, setUsers] = useState([])
  // users → the current state value   //[]
  // setUsers() → a function to update it

  useEffect(() => {
    axios.get('/api/users')
    .then((response) => {
      setUsers(response.data)
    })
    .catch((error) => {
      console.log(error);
    })
  })

  return (
    <>
    <h1> Backend Frontend Connection </h1>
    <p>Users : {users.length}</p>

    {
      users.map((user,index) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p> {user.email} </p>
        </div>
      ))
    }
    </>
  )
}

export default App