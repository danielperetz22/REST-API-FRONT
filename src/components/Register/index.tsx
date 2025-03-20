import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import {
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  Alert,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { handleGoogleResponse } from "../../hook/googleAuth";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../services/api_client";
import defaultImage from "../../assets/profile-default.jpg";

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
  const { login, isAuthenticated } = useAuth();

  // Use effect to navigate when the user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, navigating to /posts");
      navigate("/posts");
    }
  }, [isAuthenticated, navigate]);

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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
      formData.append("profileImage", blob, "profile-default.jpg");
    }

    try {
      const response = await apiClient.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      console.log("🔍 Registration Data from Server:", data);

      if (
        !data.refreshToken ||
        !data.accessToken ||
        !data.user?._id ||
        !data.user?.email ||
        !data.user?.username ||
        !data.user?.profileImage
      ) {
        console.error("Registration failed. Missing credentials:", data);
        setError("Registration failed. Missing credentials.");
        return;
      }


      console.log("Registration Success:", data);

      login(
        data.refreshToken,
        data.user._id,
        data.user.email,
        data.user.username,
        data.user.profileImage
      );

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Error response:", err.response.data);
          // Check if the response status is 409 (Conflict) or if there's an error property
          if (err.response.status === 409 || err.response.data.error) {
            setError(
              "Email is already in use. Please try another email or log in if you already have an account."
            );
          } else {
            setError(err.response.data.error || err.response.data.message || "Failed to register.");
          }
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
    <Grid container style={{ minHeight: "100%", width: "100%" }}>
      <Grid item xs={12} md={5} sx={{ backgroundColor: "#d2cbc5", display: "flex", flexDirection: "column", justifyContent: "center", padding: { xs: "1.5rem", md: "2rem" } }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" }, textAlign: { xs: "center", md: "left" }, width: "100%", maxWidth: "350px", marginLeft: { xs: 0, md: "100px" },paddingTop: { xs: "50px", md: 0 } }}>
          <Typography variant="h3" component="h3" fontWeight={900} color="#352d2a">Sign Up To Our App</Typography>
          <Typography variant="subtitle1" component="p" fontFamily="Dancing Script" sx={{ marginTop: "1rem", color: "#352d2a", fontSize: { xs: "1.2rem", md: "1.5rem" } }}>Here for the first time? Let's get you settled in</Typography>
        </Box>
      </Grid>
  
      <Grid item xs={12} md={7} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: { xs: "90%", md: "400px" }, marginTop: { xs: "40px", md: "80px" } }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", mb: 3 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar src={previewImage || defaultImage} alt="Profile Preview" sx={{ width: 150, height: 150 }} />
                  <IconButton color="default" component="label" aria-label="upload picture" sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "white", boxShadow: 3, "&:hover": { backgroundColor: "lightgray" } }}>
                    <AddPhotoAlternateOutlinedIcon />
                    <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                  </IconButton>
                </Box>
              </Box>
  
              <TextField id="email" label="Email" size="small" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
              <TextField id="verify-email" label="Verify Email" size="small" value={verifyEmail} placeholder="Re-enter your email" onChange={(e) => setVerifyEmail(e.target.value)} fullWidth />
              <TextField id="username" label="Username" size="small" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
              <TextField id="password" label="Password" size="small" type="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
              <TextField id="confirm-password" label="Confirm Password" size="small" type="password" value={confirmPassword} placeholder="Re-enter your password" onChange={(e) => setConfirmPassword(e.target.value)} />
  
              <Button type="submit" variant="contained" fullWidth>Submit</Button>
              <Divider sx={{ mt: 4, fontSize:"20",fontFamily:"Dancing Script" }} >or</Divider>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}>Already have an account? <Link to="/login">Login here</Link></Typography>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
  };

export default Register;
