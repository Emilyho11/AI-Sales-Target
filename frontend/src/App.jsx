import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmailEditor from './pages/EmailEditor';
import Footer from './components/Footer';
import Login from './pages/Login';
import { AuthProvider } from './components/AuthContext';
import Signup from './pages/Signup';
import Logout from './pages/Logout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow bg-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/emailEditor" element={<EmailEditor />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
