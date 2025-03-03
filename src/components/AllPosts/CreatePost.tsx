import { useState, useRef } from "react";
import axios from "axios";
import postService from "../../services/post_service"; 
import {
  Container,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useAuth } from "../../context/AuthContext";
import { getCorrectImageUrl } from "../../until/imageProfile";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false); // AI Loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userProfileImage, userUsername, userEmail } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateAIContent = async () => {
    if (!title) {
      setError("Please enter a title before generating content.");
      return;
    }

    setLoadingAI(true);
    try {
      const aiContent = await postService.generateBookDescription(title, "A social media post", "engaging");
      setContent(aiContent);
    } catch (error) {
      setError("Failed to generate AI content.");
      console.error("AI Generation Error:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:3000/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Post created successfully:", response.data);

      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setError(null);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create post.");
        console.error("Create post error:", err.response?.data || err.message);
      } else {
        setError("Failed to create post.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ mt: 16, mb: 4, height: "100vh", display: "flex", alignItems: "center" }}>
      <Card sx={{ maxWidth: 500, mx: "auto", borderRadius: 2 }}>
        <CardHeader
          avatar={<Avatar src={getCorrectImageUrl(userProfileImage)} />}
          title={
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {userUsername}
            </Typography>
          }
          subheader={userEmail}
        />
        <Box sx={{ position: "relative", height: 350, backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {imagePreview ? (
            <CardMedia
              component="img"
              height="350"
              image={imagePreview}
              alt="Preview"
              sx={{ objectFit: "cover" }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No image selected
            </Typography>
          )}
          <IconButton
            color="default"
            component="label"
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
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
              ref={fileInputRef}
              hidden
              onChange={handleFileChange}
            />
          </IconButton>
        </Box>
        <CardContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Post Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="dense"
            variant="outlined"
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Post Content"
              fullWidth
              multiline
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="dense"
              variant="outlined"
            />
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleGenerateAIContent} 
              disabled={loadingAI}
              sx={{ minWidth: 150 }}
            >
              {loadingAI ? <CircularProgress size={24} color="inherit" /> : "Generate with AI"}
            </Button>
          </Box>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ minWidth: 150 }}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Post"}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Post created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreatePost;
