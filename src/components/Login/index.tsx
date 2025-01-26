import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";



interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (!identifier || !password) {
      setError("Both fields are required.");
      return;
    }

    if (!isEmail && identifier.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    const validEmail = "test@example.com";
    const validUsername = "testuser";
    const validPassword = "password123";

    if (
      (identifier === validEmail || identifier === validUsername) &&
      password === validPassword
    ) {
      onLogin(); 
      navigate("/"); 
    } else {
      setError("Invalid email/username or password.");
    }
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    if (credentialResponse.credential) {
      console.log("Google Token:", credentialResponse.credential);
      onLogin(); 
      navigate("/"); 
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    setError("Failed to login with Google.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p>{error}</p>} {/* show error msg*/}
      <div>
        <label>Email or Username</label>
        <input
          type="text"
          placeholder="Enter your email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
      <hr />
      <h3>Or login with Google</h3>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
      <p></p>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
};

export default Login;
