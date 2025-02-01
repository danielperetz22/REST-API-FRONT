import { HomePage } from './components/Home_page';
import { Header } from './components/Header';
import './App.css';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import { useState } from 'react';
import PostsList from './components/AllPosts/PostList';
import ProtectedRoute from './until/ProtectedRoutes';
import ProfilePage from './components/Profile/ProfilePage';
import EditProfilePage from './components/Profile/EditProfile';



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
              <Route element={<ProtectedRoute />}>
                <Route path="/posts" element={<PostsList />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/edit_profile" element={<EditProfilePage/>} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}
export default App;
