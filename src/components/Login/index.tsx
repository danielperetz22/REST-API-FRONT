import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { handleGoogleResponse } from "../../hook/googleAuth";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to log in.");
        return;
      }

      const data = await response.json();
      console.log("Login Success:", data);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      onLogin();
      navigate("/");
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      handleGoogleResponse(credentialResponse.credential, navigate, setError);
      onLogin();
    }
  };
  
  const handleGoogleError = () => {
    setError("Failed to login with Google.");
  };

  return (
    <Grid container style={{ minHeight: "100vh", width:"100vw" }}>
      {/* Left Section */}
      <Grid xs={12} md={5} sx={{
          backgroundColor: "#f9f9f7", display: "flex", flexDirection: "column",justifyContent: "center", padding: "2rem",}}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start",textAlign:"left", width: "100%", maxWidth: "350px", marginLeft: "100px" }}>
        <Typography variant="h3" component="h1" fontWeight="bold" > Welcome Back</Typography>
        <Typography variant="subtitle1" component="p"
          sx={{ marginTop: "1rem", color: "#666" }}>
          Let's get you signed in
        </Typography>
        </Box>
      </Grid>

      {/* Right Section - Form */}
      <Grid xs={12} md={6}
        sx={{ display: "flex",flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem",}}>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "400px" }}>
          {error && ( <Typography variant="body2" color="error"sx={{ marginBottom: 2 }}> {error}</Typography>)}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex",justifyContent: "center", flexDirection: "column", gap: 2 }}>
              {/* Identifier Field */}
              <TextField
                id="email"
                label="Email"
                size="small"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password Field */}
              <TextField id="password" label="Password" size="small" type="password" value={password} placeholder="Enter your password" 
              onChange={(e) => setPassword(e.target.value)}/>

              {/* Submit Button */}
              <Button type="submit" variant="contained" fullWidth> Submit</Button>

              {/* Google Login */}
              <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}>
                Or log in with Google
              </Typography>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />

              {/* Register Link */}
              <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}> 
              Don't have an account?{" "} <Link to="/register">Register here</Link> </Typography>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
