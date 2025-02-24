import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Alert, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { handleGoogleResponse } from "../../hook/googleAuth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
  
    try {
      console.log("Sending login request with email:", email);
  
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const text = await response.text();
      console.log("Raw response from server:", text);
  
      if (!response.ok) {
        try {
          const data = JSON.parse(text);
          console.error("Login error:", data);
          setError(data.message || "Invalid email or password.");
        } catch {
          console.error("Invalid response from server:", text);
          setError("Invalid response from server.");
        }
        return;
      }
  
      let data;
      try {
        data = JSON.parse(text);
        console.log("Parsed login response:", data);
      } catch {
        console.error("Failed to parse JSON response:", text);
        setError("Failed to parse server response.");
        return;
      }
  
      if (!data.accessToken || !data.refreshToken || !data._id || !data.email || !data.username || !data.profileImage) {
        console.error("Login failed. Missing credentials:", data);
        setError("Login failed. Missing credentials.");
        return;
      }
  
      console.log("Login Success:", data);
  
      login(data.refreshToken, data._id, data.email, data.username, data.profileImage);
      navigate("/posts");
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    if (credentialResponse.credential) {
      await handleGoogleResponse(
        credentialResponse.credential,
        navigate,
        setError,
        login 
      );
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    setError("Failed to login with Google.");
  };

  return (
    <Grid container style={{ minHeight: "100vh", width: "100vw" }}>
      <Grid item xs={12} md={5} sx={{ backgroundColor: "#fefbf5", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", width: "100%", maxWidth: "400px", marginLeft: "100px" }}>
          <Typography variant="h3" component="h3" fontWeight={900} color="#eb341f">Welcome Back</Typography>
          <Typography variant="subtitle1" component="p" sx={{ marginTop: "1rem", color: "#eb341f" }}>Let's get you signed in</Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={7} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "400px", marginTop: "80px" }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", gap: 2 }}>
              <TextField id="email" label="Email" size="small" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
              <TextField id="password" label="Password" size="small" type="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" variant="contained" fullWidth>Submit</Button>

              <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}>Or log in with Google</Typography>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

              <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}>
                Don't have an account?{" "} <Link to="/register">Register here</Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
