import { HomePage } from './components/Home_page';
import { Header } from './components/Header';
import './App.css';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import PostsList from './components/AllPosts/PostList';
import ProtectedRoute from './until/ProtectedRoutes';
import ProfilePage from './components/Profile/ProfilePage';



function App() {
 
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <Router>
        <div>
          <div className="HeaderContainer">
            {/* login logout func Header */}
            <Header />
          </div>
          <div className="HomePageContainer">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/posts" element={<PostsList />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}
export default App;
