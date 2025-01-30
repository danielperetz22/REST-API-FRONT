import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, Box, Avatar, Grid } from "@mui/material";

const ProfilePage = () => {
  interface UserProfile {
    _id: string;
    profileImage: string;
    email: string;
  }

  const [user, setUser] = useState<UserProfile | null>(null);
  const token = localStorage.getItem("accessToken");


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
    // <Container maxWidth="sm" sx={{ mt: 4 }}>
    //   <Box display="flex" alignItems="center" flexDirection="column" sx={{ mb: 4 }}>
    //   <Avatar src={user.profileImage} alt="Profile" sx={{ width: 100, height: 100, mb: 2 }} />
    //     <Typography variant="h5">{user.email}</Typography>
    //     <Button
    //       variant="contained"
    //       component={Link}
    //       to="/edit-profile"
    //       sx={{ mt: 2, textTransform: "none" }}
    //     >
    //       Edit Profile
    //     </Button>
    //   </Box>
    // </Container>
    <Box sx={{ width: "100vw", height: "90vh", display: "flex", marginTop:"10rem"}}>
      <Container  maxWidth="md" sx={{width: "90vw" }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}
            sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem",}}>
            <Box
              sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", width: "100%" }}>
                <Avatar src={user.profileImage} alt="Profile" sx={{ width: 200, height: 200, mb: 2 }} />
              </Box>
              
              </Grid>
              <Grid item xs={12} md={5}>
            <Box>
            <Typography variant="h5">{user.email}</Typography>
            <Button
          variant="contained"
          component={Link}
          to="/edit-profile"
          sx={{ mt: 2, textTransform: "none" }}
        >
          Edit Profile
        </Button>
            </Box>
        </Grid>
      </Grid>
      </Container>
    </Box>



    
  );
};

export default ProfilePage;
