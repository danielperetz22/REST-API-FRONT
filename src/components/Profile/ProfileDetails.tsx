import { Box, Avatar, TextField, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCorrectImageUrl } from "../../until/imageProfile";
import { apiClient } from "../../services/api_client";


const ProfileDetails = () => {
  interface UserProfile {
    _id: string;
    username: string;
    profileImage: string;
    email: string;
  }

  const [user, setUser] = useState<UserProfile | null>(null);
  const token = localStorage.getItem("token");
  const profileImage = localStorage.getItem("userProfileImage");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          console.error("No token found!");
          return;
        }

        const response = await apiClient.get("/auth/profile");


        console.log("Fetched user:", response.data);
        setUser(response.data);
        console.log("Fetched user:", user);
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
    <Box
      sx={{
        width: "100%",
        mt: 4,
        mb: 4,
        backgroundColor: "#F7F5F2",
        p: 4,
        pt: 12,
      }}
    >
      <Box
        sx={{
          width: "60vw",
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
          mx: "auto",
        }}
      >
        <Box sx={{ width: 250, height: 250, position: "relative" }}>
          <Avatar
            src={profileImage ? getCorrectImageUrl(profileImage) : ""}
            alt="Profile"
            sx={{ width: 250, height: 250 }}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            size="small"
            value={user.email}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Username"
            size="small"
            value={user.username}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <Button
            variant="outlined"
            component={Link}
            to="/edit_profile"
            sx={{
              mt: "15%",
              textTransform: "none",
              alignSelf: "flex-end",
            }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileDetails;
