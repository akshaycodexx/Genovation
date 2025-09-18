import React from 'react'
import Axios from 'axios'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Todos from './components/Todos'
import Addtodos from './components/Addtodos'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home Page</h1>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/todos' element={<Todos/>}/>
        <Route path='/addtodos' element={<h1>Addtodos Page</h1>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
