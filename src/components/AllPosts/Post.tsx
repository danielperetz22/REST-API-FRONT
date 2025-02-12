import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, TextField, Box, Collapse } from "@mui/material";
import axios from "axios";

interface Comment {
  content: string;
  owner: string;
  email: string;
}

interface PostProps {
  _id: string;
  email: string;
  title: string;
  content: string;
  imageUrl?: string;
  postId: string;
  comments?: string[];
  ownerId: string;
  onDelete: () => void;
}

const Post: React.FC<PostProps> = ({  title, content, imageUrl, postId }) => {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments?postId=${postId}`);
        setCommentList(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (showComments) {
      fetchComments();
    }
  }, [showComments, postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/api/comments`, {
        content: newComment,
        postId,
        owner: "Current User", // Replace with actual user data if available
        email: "user@example.com", // Replace with actual user data if available
      });
      setCommentList((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
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
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
        {imageUrl && <img src={imageUrl} alt={title} style={{ width: "100%", marginTop: 10 }} />}
        <Button onClick={() => setShowComments(!showComments)} sx={{ mt: 2 }}>
          {showComments ? "Hide Comments" : "Show Comments"}
        </Button>
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            {commentList.length > 0 ? (
              commentList.map((comment, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.primary">
                    {comment.owner} ({comment.email})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {comment.content}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No comments yet.</Typography>
            )}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button onClick={handleAddComment} sx={{ mt: 1 }} variant="contained">
              Add Comment
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
    
  );
};

export default Post;
