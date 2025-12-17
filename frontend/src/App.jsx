import React from 'react'
import Axios from 'axios'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'

import Chat from './components/Chat'
function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
