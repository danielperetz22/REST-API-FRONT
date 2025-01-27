import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import "./Register.css";
import {TextField,Button,Avatar,Box, Typography, Alert, IconButton, Grid} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const defaultImage= "/src/assets/profile-default.jpg";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    console.log({
        username,email,password,
        profileImage: profileImage ? profileImage.name : defaultImage,});
    navigate("/login"); 
    alert("User registered successfully!");
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Google Registration Success:", credentialResponse);
    if (credentialResponse.credential) {
      console.log("Google Token:", credentialResponse.credential);
      navigate("/login"); // מפנה לדף התחברות לאחר הרשמה עם Google
    }
  };

  const handleGoogleError = () => {
    console.error("Google Registration Failed");
    setError("Failed to register with Google.");
  };

//   return (
    
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems:'center', mt: 2 }}>
//       <Typography variant="overline" fontSize={24} gutterBottom marginBottom={5}>Let's Get You Signed In</Typography>
//       {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

//       <form onSubmit={handleSubmit}>
//         {/* Profile Image */}
//         <Box sx={{ display:"flex",alignItems:"flex-end",justifyContent: "center",gap:"1", textAlign: "center", mb: 3 }}>
//  {previewImage ? (
//             <Avatar src={previewImage} alt="Profile Preview"
//               sx={{ width:150, height: 150, mx: "auto",}} />
//           ) : (
//         <Avatar
//             alt="Default Profile"
//             src="/src/assets/profile-default.jpg" 
//             sx={{ width: 150, height: 150, mx: "auto",}}/>)}
//         <IconButton
//             color="default"
//             component="label"
//             aria-label="upload picture"
//             >
//               <AddPhotoAlternateOutlinedIcon />
//               <input type="file" accept="image/*" hidden onChange={handleFileChange} />
//             </IconButton>
//           </Box>

//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      

//           {/* Username */}
//           <TextField id="username" label="Username" size="small" value={username} placeholder="Enter your username"
//           onChange={(e) => {setUsername(e.target.value);}}/>

//           {/* Email */}
//           <TextField id="email" label="email" size="small" value={email} placeholder="Enter your email"
//           onChange={(e) => setEmail(e.target.value)} />

//           {/* Password */}
//           <TextField id="password" label="password" size="small" value={email} placeholder="Enter your password"
//           onChange={(e) => setPassword(e.target.value)} />

//           {/* Submit Button */}
//           <Button type="submit" variant="contained" fullWidth>
//             Submit
//           </Button>

//           {/* Divider */}
//         <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}>
//           Or register with Google
//         </Typography>


//         <GoogleLogin
//            onSuccess={handleGoogleSuccess}
//            onError={handleGoogleError}
//           />

//           <Typography variant="overline" align="center" fontSize={14} sx={{ mt: 2 }}>
//           Already have an account?  <Link to="/login">Login here</Link>
//         </Typography>

//         </Box>
//       </form>
//       </Box>
//   );
// };
return (
  <Grid container style={{ minHeight: "100vh", width: "100vw" }}>
    {/* Left Section */}
    <Grid xs={12} md={5} sx={{ backgroundColor: "#f9f9f7", display: "flex", flexDirection: "column", justifyContent: "baseline", padding: "2rem" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start",textAlign:"left", width: "100%", maxWidth: "350px", marginTop: "200px" }}>
        <Typography variant="h3" component="h1" fontWeight="bold">Sign Up To Our App</Typography>
        <Typography variant="subtitle1" component="p" sx={{ marginTop: "1rem", color: "#666" }}>
        Here for the first time? Let's get you settled in
        </Typography>
      </Box>
    </Grid>

    {/* Right Section - Form */}
    <Grid xs={12} md={7} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "400px",marginTop: "80px" }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

            {/* Username Field */}
            <TextField id="username" label="Username" size="small" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />

            {/* Email Field */}
            <TextField id="email" label="Email" size="small" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />

            {/* Password Field */}
            <TextField id="password" label="Password" size="small" type="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />

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
