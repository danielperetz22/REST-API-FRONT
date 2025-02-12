import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, TextField, Box, Collapse } from "@mui/material";
import axios from "axios";

interface PostProps {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  comments?: string[];
  ownerId: string;
  onDelete: () => void;
}

const Post: React.FC<PostProps> = ({ _id, title, content, imageUrl, comments = [], ownerId, onDelete }) => {
  const [commentList, setCommentList] = useState<string[]>(comments);
  const [newComment, setNewComment] = useState<string>("");
  const [showComments, setShowComments] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found!");

        const response = await axios.get("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserId(response.data._id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  console.log("ownerId:", ownerId);
  console.log("userId:", userId);
  
  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    setCommentList([...commentList, newComment]);
    setNewComment("");
    setIsAddingComment(false); 
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");

      await axios.delete(`http://localhost:3000/post/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onDelete();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit_post/${_id}`);
  };
  

  return (
    <Card sx={{ maxWidth: 800, width: "100%", mx: "auto", boxShadow: 4, borderRadius: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {content}
        </Typography>
        {imageUrl && <Box component="img" src={imageUrl} alt={title} sx={{ width: "100%", mt: 2, borderRadius: 2 }} />}
      </CardContent>

      {ownerId === userId && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      )}

      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setShowComments(!showComments)}>
        {showComments ? "Hide Comments" : "Show Comments"}
      </Button>

      <Collapse in={isAddingComment}>
        <Box sx={{ display: "flex", gap: 1, p: 2 }}>
          <TextField
            fullWidth
            label="Type Comment..."
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddComment}>
            Send
          </Button>
        </Box>
      </Collapse>

      <Button variant="outlined" sx={{ m: 2 }} onClick={() => setIsAddingComment(true)}>
        Add Comment
      </Button>

      <Collapse in={showComments}>
        <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
          {commentList.length > 0 ? (
            commentList.map((comment, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                - {comment}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No Comments Yet
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
    
  );
};

export default Post;

