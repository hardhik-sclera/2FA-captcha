import React from 'react'
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import TwoFactorAuth from './pages/TwoFactorAuth.jsx'
import OTPInput from './pages/OTPInput.jsx'
axios.defaults.baseURL="http://localhost:3000"
axios.defaults.withCredentials=true
const App = () => {
  return (
    <div>
      <Router>
        <Toaster position='top-right' toastOptions={{duration:1000}}/>
        <Routes>
          <Route path='/register' element={<Register/>}/> 
          <Route path='/' element={<Navigate to='/login'/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/2fa/setup' element={<TwoFactorAuth/>}/>
          <Route path='/protected/home' element={<Home/>}/>
          <Route path='/otp' element={<OTPInput/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App