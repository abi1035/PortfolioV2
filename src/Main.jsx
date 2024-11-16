import './style.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import Navbar from './Components/Navbar/Navbar.jsx'
import Homepage from './Homepage.jsx'
import Projects from './Pages/Projects/Projects.jsx'
import Contact from './Pages/Contact/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}