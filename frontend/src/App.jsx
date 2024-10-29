import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmailEditor from './pages/EmailEditor';
import Footer from './components/Footer';
import Summary from './pages/Summary';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/emailEditor" element={<EmailEditor />} />
            <Route path="/summarizer" element={<Summary />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
