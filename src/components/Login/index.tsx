import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";



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
    <Grid container style={{ minHeight: "100vh", width:"100vw" }}>
      {/* Left Section */}
      <Grid xs={12} md={5} sx={{
          backgroundColor: "#f9f9f7", display: "flex", flexDirection: "column",justifyContent: "baseline", padding: "2rem",}}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start",textAlign:"left", width: "100%", maxWidth: "350px", marginTop: "200px" }}>
        <Typography variant="h3" component="h1" fontWeight="bold" > Welcome Back</Typography>
        <Typography variant="subtitle1" component="p"
          sx={{ marginTop: "1rem", color: "#666" }}>
          Let's get you signed in
        </Typography>
        </Box>
      </Grid>

      {/* Right Section - Form */}
      <Grid xs={12} md={6}
        sx={{ display: "flex",flexDirection: "column", justifyContent: "baseline", alignItems: "center", padding: "2rem",}}>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "400px", marginTop: "200px" }}>
          {error && ( <Typography variant="body2" color="error"sx={{ marginBottom: 2 }}> {error}</Typography>)}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex",justifyContent: "center", flexDirection: "column", gap: 2 }}>
              {/* Identifier Field */}
              <TextField
                id="identifier"
                label="Email or Username"
                size="small"
                value={identifier}
                placeholder="Enter your email or username"
                onChange={(e) => setIdentifier(e.target.value)}
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
