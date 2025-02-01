import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Box, Avatar, IconButton, Alert } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", username: "", profileImage: "" });
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

        setUser(response.data);
        setNewUsername(response.data.username);
        setPreviewImage(response.data.profileImage);
        setNewEmail(response.data.email);
        setVerifyNewEmail(response.data.email);
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

      if(!token){
        setError("Not authenticated!")
        return;
      }
      
      
      if (newEmail && verifyNewEmail && newEmail !== verifyNewEmail) {
        setError("New emails do not match!");
        return;
      }

      if(newPassword.trim()!==""||oldPassword.trim()!==""||confirmNewPassword.trim()!==""){
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match!");
            return;
          }
        if (newPassword && newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }
        if(newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
        }
    }

      if(newUsername.length < 2) {
        setError("Username must be at least 2 characters.");
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

  
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }
  
      const response = await axios.put("http://localhost:3000/auth/profile", formData, 
{
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Server response:", response.data);
  
      if (response.data.user) {
        setUser(response.data.user);
        setSuccess("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message ? error.response.data.message : "Error updating profile";
      setError(errorMessage);
      if (axios.isAxiosError(error)) {
        console.error("Update error:", error.response?.data || error);
      } else {
        console.error("Update error:", error);
      }
    }
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center",marginTop:"15rem"}}>
    <Container maxWidth="md" sx={{ width: "90vw" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", flexWrap: "wrap", gap: 4 }}>
        
        <Box sx={{ position: "relative", width: 200, height: 200 }}>
        <Avatar src={previewImage || user.profileImage} alt="Profile Preview" sx={{ width: 200, height: 200 }} />
        <IconButton color="default" component="label" sx={{ position: "absolute", bottom: 10, right: 10, backgroundColor: "white", boxShadow: 1, borderRadius: "50%", width: 40, height: 40, ":hover": { backgroundColor: "rgba(255, 255, 255, 0.8)" } }}>
          <AddPhotoAlternateOutlinedIcon />
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </IconButton>
      </Box>
  
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, width: "60%", minWidth: 300 }}>
            <TextField label="Email" size="small" variant="outlined" fullWidth value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <TextField label="Verify Email" size="small" variant="outlined" fullWidth value={verifyNewEmail} onChange={(e) => setVerifyNewEmail(e.target.value)} />
            <TextField label="Username" size="small" variant="outlined" fullWidth value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <TextField label="Old Password" type="password" size="small" variant="outlined" fullWidth value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <TextField label="New Password" type="password" size="small" variant="outlined" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <TextField label="Confirm New Password" type="password" size="small" variant="outlined" fullWidth value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button variant="outlined" component={Link} to="/profile" sx={{ textTransform: "none", alignSelf: "flex-end" }}>
                    Return to Profile
                </Button>
                <Button variant="contained" color="primary" onClick={handleUpdateProfile} sx={{  textTransform: "none", alignSelf: "flex-start" }}>
                    Save Changes
                </Button>
            </Box>
           
          </Box>
        </Box>
  
      </Container>
    </Box>
  );
};

export default EditProfilePage;
