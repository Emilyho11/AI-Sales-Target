import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Library from './pages/Library';

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
					<Navbar />
					<div className="flex-1 bg-white relative">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/myLibrary" element={<Library />} />
						</Routes>
					</div>
				</div>
    </BrowserRouter>
  )
}

export default App
