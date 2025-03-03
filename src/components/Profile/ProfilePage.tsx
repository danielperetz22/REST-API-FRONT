import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
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
    <Box sx={{ width: "100%", textAlign: "center",bgcolor:"#FEFCF9" }}>
      <ProfileDetails />
      <Box sx={{ display:"flex", alignItems:"center", gap: 48 }} >
        <Box/>
        <Typography variant="overline" sx={{fontWeight: "bold", fontSize: 42, color: "#a6a29a", justifySelf:"flex-start" }}>
          My Posts
        </Typography>
        <Button
          variant="text"
          component="a"
          href="/create_post"
          sx={{ gap: 0.5,justifySelf:"flex-end"}}
        >
          <AddIcon />Create Post
        </Button>
      </Box>
      <Divider/>
      <ProfilePost />
    </Box>
  );
}
export default ProfilePage;
