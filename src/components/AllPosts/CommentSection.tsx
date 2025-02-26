import React, { useState } from "react";
import { Box, Typography, TextField, Button, Divider, Stack } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";

interface Comment {
  _id?: string;
  content: string;
  email: string;
  owner: string;
  username: string;
  postId: string;
}

interface PostType {
  _id: string;
  title: string;
  content: string;
  image: string;
  email: string;
  comments: Comment[];
}

interface CommentSectionProps {
  post: PostType;
  authUserId: string;     
  authUserEmail: string; 
  authUserUsername: string;  
  onCommentAdded: (newComment: Comment) => void; 
}

const CommentSection: React.FC<CommentSectionProps> = ({
  post,
  authUserId,
  authUserEmail,
  authUserUsername,
  onCommentAdded
}) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:3000/comment",
        {
          content: newComment,
          postId: post._id,
          owner: authUserId,
          email: authUserEmail,
          username: authUserUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const createdComment: Comment = response.data.newComment; 
      
      
      setNewComment(""); 
      onCommentAdded(createdComment); 
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  

  return (
    <Box sx={{ mt: 2 }}>


      {post.comments?.length > 0 ? (
        post.comments.map((comment) => (
          <Box key={comment._id} sx={{ mb: 2 }}>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle2" color="text.primary">
              {comment.username} ({comment.email}):
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {comment.content}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No comments yet.</Typography>
      )}

<Box sx={{ mt: 3 }}>
  <Stack direction="row" spacing={2} alignItems="center">
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Add a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      size="small"
    />
    <Button
      onClick={handleAddComment}
      variant="outlined"
      disabled={!newComment.trim()}
      sx={{ whiteSpace: "nowrap", height: "100%" }}
      endIcon={<SendIcon />} 
    >
    </Button>
  </Stack>
</Box>
    </Box>
  );
};

export default CommentSection;