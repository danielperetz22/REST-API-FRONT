import { Box, Button, CircularProgress, List, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import ProfileDetails from "./ProfileDetails"; 
import ProfilePost from "./ProfilePosts";
import AddIcon from '@mui/icons-material/Add';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) throw new Error("No token found!");
        const response = await axios.get("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [token]);

  if (loading) return <CircularProgress />;
  if (!user) return <Typography>No user data available.</Typography>;

  return (
    <List>
      <ProfileDetails />
      <Box sx={{ display: "flex", alignItems: "center", mt: 4, mb: 2 }}>  
        <Typography variant="overline" sx={{ fontWeight: "bold", fontSize: 50, color: "#eb341f", flexGrow: 1 , ml:32}}>
          My Posts
        </Typography>
        <Button
          variant="text"
          component="a"
          href="/create_post"
          sx={{  color: "#eb341f", borderColor: "#eb341f", gap: 1 ,mr:24 }}
        >
          <AddIcon />
        </Button>
      </Box>  
      <ProfilePost />
    </List>
  );
};

export default ProfilePage;
