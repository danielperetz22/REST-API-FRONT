import { useState, useRef } from "react";
import axios from "axios";
import {Container, TextField, Button, Typography, CircularProgress, IconButton,} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image"; 

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
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
      } else {
        setError("Failed to create post.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ marginTop: 30 }} maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Create New Post
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Content"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Image Upload Button */}
        <IconButton onClick={() => fileInputRef.current?.click()} sx={{ mt: 2 }}>
          <ImageIcon fontSize="large" color="primary" />
        </IconButton>
        {image && <Typography variant="body2">{image.name}</Typography>}

        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </form>
    </Container>
  );
};

export default CreatePost;
