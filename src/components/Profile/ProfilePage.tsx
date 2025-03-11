import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ProfileDetails from "./ProfileDetails"; 
import ProfilePost from "./ProfilePosts";
import AddIcon from '@mui/icons-material/Add';
import { apiClient } from "../../services/api_client";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) throw new Error("No token found!");
        const response = await apiClient.get("/auth/profile");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ width: "100%", height: "100vh", bgcolor: "#FEFCF9", display: "flex",justifyContent: "center", alignItems: "center", }} >
        <CircularProgress />
      </Box>
    );
  }
  if (!user) return <Typography>No user data available.</Typography>;

  return (
    <Box sx={{ width: "100%", bgcolor: "#FEFCF9" }}>
      <ProfileDetails />
  
      <Box
        sx={{
          maxWidth: { xs: "90vw", md: "60vw" },
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          px: 2,
          py: 2,
          gap: { xs: 2, md: 0 }
        }}
      >
        <Typography
          variant="h2"
          sx={{
            alignSelf: { xs: "center", md: "flex-start" },
            fontWeight: "bold",
            color: "#a6a29a",
            fontFamily: "monospace",
            fontSize: { xs: "2.5rem", md: "4rem" },
            textAlign: { xs: "center", md: "left" }
          }}
        >
          My Posts
        </Typography>
        <Button
          variant="text"
          component="a"
          href="/create_post"
          sx={{
            display: "flex",
            alignItems: "center",
            alignSelf: "center" ,
            gap: 0.5
          }}
        >
          <AddIcon /> Create Post
        </Button>
      </Box>
  
      <Divider />
  
      <ProfilePost />
    </Box>
  );
}
export default ProfilePage;
