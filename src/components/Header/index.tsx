import { useState } from "react";

export const Header = () => {

    const [isLogIn , setIsLogIn] = useState(false);
    const hendleLogIn = () => {
        setIsLogIn(true)
    };
    const hendleLogOut = () => {
        setIsLogIn(false)
    };

    return(
        <header>
            <nav>
            {isLogIn ? (
          <div className="nav-buttons">
            <button onClick={() => alert("Go to Home")}>Home</button> 
            <button onClick={() => alert("Go to Profile")}>Profile</button>
            <button onClick={() => alert("Create a New Post")}>New Post</button>
            <button onClick={() => alert("Open Chat")}>Chat</button>
            <button onClick={hendleLogIn}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={() => alert("Go to Register")}>Register</button>
            <button onClick={hendleLogOut}>Log In</button>
          </div>
        )}
      </nav>
    </header>
    );
};