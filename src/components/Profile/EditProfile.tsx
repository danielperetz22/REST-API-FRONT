import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Alert,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { apiClient } from "../../services/api_client";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    username: "",
    profileImage: "",
  });
  const [newUsername, setNewUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [verifyNewEmail, setVerifyNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const profileImageFromStorage = localStorage.getItem("userProfileImage");
  const visitCount = parseInt(localStorage.getItem("visitCount") || "0", 10);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          console.error("No token found!");
          return;
        }
        const response = await apiClient.get("/auth/profile");
        setUser(response.data);
        setNewUsername(response.data.username);
        setNewEmail(response.data.email);
        setVerifyNewEmail(response.data.email);

        if (visitCount === 0 && profileImageFromStorage) {
          setPreviewImage(profileImageFromStorage);
        } else {
          setPreviewImage(response.data.profileImage);
        }
        localStorage.setItem("visitCount", (visitCount + 1).toString());
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchUserProfile();
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!token) {
        setError("Not authenticated!");
        return;
      }

      if (newEmail && verifyNewEmail && newEmail !== verifyNewEmail) {
        setError("New emails do not match!");
        return;
      }

      const formData = new FormData();
      formData.append("username", newUsername);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      if (newEmail) {
        formData.append("email", newEmail);
      }
      if (oldPassword.trim() !== "") {
        formData.append("oldPassword", oldPassword);
      }
      if (newPassword.trim() !== "") {
        formData.append("newPassword", newPassword);
      }
      if (confirmNewPassword.trim() !== "") {
        formData.append("confirmNewPassword", confirmNewPassword);
      }

      console.log("🔄 Sending update profile request...");
      const response = await apiClient.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.user) {
        console.log("✅ Profile (and posts) updated:", response.data);
        const updatedUser = response.data.user;

        // שמירת ערכי המשתמש החדשים ב-localStorage
        localStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("userId", updatedUser._id);
        localStorage.setItem("userEmail", updatedUser.email);
        localStorage.setItem("userProfileImage", updatedUser.profileImage);
        localStorage.setItem("userUsername", updatedUser.username);
        localStorage.setItem("visitCount", "1");

        setSuccess("Profile updated successfully! (Posts also updated!)");
        setPreviewImage(updatedUser.profileImage);
        navigate("/profile");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error updating profile";
      setError(errorMessage);
      console.error("Update error:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        mt: 4,
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
            src={previewImage || user.profileImage}
            alt="Profile Preview"
            sx={{ width: 250, height: 250 }}
          />
          <IconButton
            color="default"
            component="label"
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              backgroundColor: "white",
              boxShadow: 1,
              borderRadius: "50%",
              width: 40,
              height: 40,
            }}
          >
            <AddPhotoAlternateOutlinedIcon />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            size="small"
            variant="outlined"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <TextField
            label="Verify Email"
            size="small"
            variant="outlined"
            fullWidth
            value={verifyNewEmail}
            onChange={(e) => setVerifyNewEmail(e.target.value)}
          />
          <TextField
            label="Username"
            size="small"
            variant="outlined"
            fullWidth
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <TextField
            label="Old Password"
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mt: "8%",
            }}
          >
            <Button
              variant="outlined"
              component={Link}
              to="/profile"
              sx={{
                alignSelf: "flex-end",
              }}
            >
              Return to Profile
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              sx={{
                backgroundColor: "#a6a29a",
                color: "white",
                alignSelf: "flex-start",
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfilePage;
