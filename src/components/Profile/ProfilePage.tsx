import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, Box, Avatar, TextField } from "@mui/material";

const ProfilePage = () => {
  interface UserProfile {
    _id: string;
    username: string;
    profileImage: string;
    email: string;
  }

  const [user, setUser] = useState<UserProfile | null>(null);
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          console.error("No token found!");
          return;
        }

        const response = await axios.get("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched user profile:", response.data);

        console.log("Fetched user:", response.data); 
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center",marginTop:"15rem"}}>
    <Container maxWidth="md" sx={{ width: "90vw" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", flexWrap: "wrap", gap: 4 }}>

      <Box sx={{ position: "relative", width: 200, height: 200 }}>
          <Avatar src={user.profileImage} alt="Profile" sx={{ width: 200, height: 200, mb: 2 }} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, width: "60%", minWidth: 300 }}>
            <TextField label="Email" size="small" value={user.email} InputProps={{ readOnly: true }} fullWidth />
            <TextField label="Username" size="small" value={user.username} InputProps={{ readOnly: true }} fullWidth />
            <Button variant="contained" component={Link} to="/edit_profile" sx={{  textTransform: "none", alignSelf: "flex-end" }}>
              Edit Profile
            </Button>
          </Box>
  
        </Box>
  
      </Container>
    </Box>
  );
};

export default ProfilePage;
