import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import "./Register.css";
import { TextField, Button, Avatar, Box, Typography, Alert, IconButton, Grid } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import axios from "axios";
import { handleGoogleResponse } from "../../hook/googleAuth";
import { useAuth } from "../../context/AuthContext";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const defaultImage = "/src/assets/profile-default.jpg";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !verifyEmail || !password || !username) {
      setError("All fields are required.");
      return;
    }

    if (email !== verifyEmail) {
      setError("Emails do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    } else {
      const response = await fetch(defaultImage);
      const blob = await response.blob();
      formData.append("profileImage", new File([blob], "profile-default.jpg", { type: "image/jpeg" }));
    }

    if(username.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    } 

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
      const data = response.data;
      console.log("Registration Success:", response.data); 
      <Alert severity="success">User registered successfully!</Alert>
      login(data.refreshToken, data._id, data.email, data.username, data.profileImage);  
      navigate("/posts"); 
    } 
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Error response:", err.response.data);
          setError(err.response.data.message || "Failed to register.");
        } else if (err.request) {
          console.error("No response received:", err.request);
          setError("No response from the server. Please try again later.");
        } else {
          console.error("Error during registration:", err.message);
          setError("An unexpected error occurred. Please try again.");
        }
      } else if (err instanceof Error) { 
        console.error("General error:", err.message);
        setError("An unexpected error occurred. Please try again.");
      } else {
        console.error("Unknown error:", err);
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      handleGoogleResponse(
        credentialResponse.credential,
        navigate,
        setError,
        login
      );
    }
  };
  
  const handleGoogleError = () => {
    setError("Failed to register with Google.");
  };

  return (
    <Grid container style={{ minHeight: "100vh", width: "100vw" }}>
      {/* Left Section */}
      <Grid item xs={12} md={5} sx={{ backgroundColor: "#fefbf5", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start",textAlign:"left", width: "100%", maxWidth: "350px", marginLeft: "100px" }}>
          <Typography variant="h3" component="h3" fontWeight={900} color="#eb341f">Sign Up To Our App</Typography>
          <Typography variant="subtitle1" component="p" sx={{ marginTop: "1rem", color:"#eb341f" }}>
          Here for the first time? Let's get you settled in
          </Typography>
        </Box>
      </Grid>

      {/* Right Section - Form */}
      <Grid item xs={12} md={7} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "400px",marginTop: "80px" }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* Profile Image */}
              <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 1, textAlign: "center", mb: 3 }}>
                {previewImage ? (
                  <Avatar src={previewImage} alt="Profile Preview" sx={{ width: 150, height: 150, mx: "auto" }} />
                ) : (
                  <Avatar alt="Default Profile" src="/src/assets/profile-default.jpg" sx={{ width: 150, height: 150, mx: "auto" }} />
                )}
                <IconButton color="default" component="label" aria-label="upload picture">
                  <AddPhotoAlternateOutlinedIcon />
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </IconButton>
              </Box>

              {/* Email Field */}
              <TextField id="email" label="Email" size="small" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
              
              {/* Verify Email Field */}
              <TextField id="verify-email" label="Verify Email" size="small" value={verifyEmail} placeholder="Re-enter your email" onChange={(e) => setVerifyEmail(e.target.value)} fullWidth />
              
              {/* Username Field */}
              <TextField id="username" label="Username" size="small" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
                
              {/* Password Field */}
              <TextField id="password" label="Password" size="small" type="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
              
              {/* Confirm Password Field */}
              <TextField id="confirm-password" label="Confirm Password" size="small" type="password" value={confirmPassword} placeholder="Re-enter your password" onChange={(e) => setConfirmPassword(e.target.value)} />

              {/* Submit Button */}
              <Button type="submit" variant="contained" fullWidth>Submit</Button>

              {/* Google Login */}
              <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}>Or register with Google</Typography>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

              {/* Login Link */}
              <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}>Already have an account? <Link to="/login">Login here</Link></Typography>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Register;
