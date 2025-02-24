import { useState, useRef } from "react";
import axios from "axios";
import {Container, TextField, Button, Typography, CircularProgress, IconButton, Box, Card,} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); 
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
      setError(null);
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

  return (
    <Container sx={{ mt: 16, maxWidth: "sm",display: "flex", justifyContent: "center" }}>
      <Card sx={{ p: 4, backgroundColor: "lightgray" }}>
      <Typography variant="overline" gutterBottom align="center" sx={{ fontWeight: "bold", fontSize: 42, color: "#eb341f" }}>
        Create New Post
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
        <Box sx={{ mt: 4,mb:2, textAlign: "center", position: "relative" }}>
          <Box sx={{ width: 350, height: 200, mx: "auto", position: "relative", overflow: "hidden", borderRadius: 2, boxShadow: 2, backgroundColor: "#f0f0f0" }}>
            {imagePreview ? (
              <Box component="img" src={imagePreview} alt="Preview" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Typography variant="body2" sx={{ lineHeight: "200px", color: "text.secondary" }}>
                No image selected
              </Typography>
            )}
            <IconButton color="default" component="label"
              sx={{ position: "absolute", bottom: 10, right: 10, backgroundColor: "white", boxShadow: 1, borderRadius: "50%", width: 40, height: 40,}}>
              <AddPhotoAlternateOutlinedIcon />
              <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handleFileChange}/>
            </IconButton>
          </Box>
        </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Post Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Post Content"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          variant="outlined"
        />



        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ minWidth: 150 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </Box>
      </form>
      </Card>
    </Container>
  );
};


export default CreatePost;
