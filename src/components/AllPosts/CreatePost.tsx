import { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography } from "@mui/material";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTitle("");
      setContent("");
      setImage(null);
      setError(null);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post");
    }
  };

  return (
    <Container maxWidth="sm">
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
        <TextField label="Content" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} margin="normal"/>
        <input type="file"accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)}style={{ marginTop: "10px" }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default CreatePost;
