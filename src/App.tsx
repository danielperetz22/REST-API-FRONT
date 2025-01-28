import { HomePage } from './components/Home_page';
import { Header } from './components/Header';
import './App.css';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import { useState } from 'react';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleLogin = () => setIsLoggedIn(true); 
  const handleLogout = () => setIsLoggedIn(false); 

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <Router>
        <div>
          <div className="HeaderContainer">
            {/* login logout func Header */}
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          </div>
          <div className="HomePageContainer">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
