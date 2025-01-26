import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header: React.FC<{
  isLoggedIn: boolean; 
  onLogout: () => void; 
}> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  const handleLogout = () => {
    onLogout(); 
    setLogoutMessage("You have been logged out successfully."); 
    navigate("/"); 
    setTimeout(() => {
      setLogoutMessage(null);
    }, 3000);
  };
  return (
    <header>
      <nav>
      {logoutMessage && <p>{logoutMessage}</p>} {/* log out msg */}
        {isLoggedIn ? (
          <div className="nav-buttons">
            <Link to="/"><button>HOME</button></Link>
            <Link to="/profile"><button>PROFILE</button></Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/register">
              <button>GET STARTED</button>
            </Link>
            <Link to="/login">
              <button>LOGIN</button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
