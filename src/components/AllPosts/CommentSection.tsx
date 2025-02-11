import React, { useState } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import axios from "axios";

interface Comment {
  _id?: string;
  content: string;
  email: string;
  owner: string;
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
  authUserId: string;       // logged-in user's _id
  authUserEmail: string;    // logged-in user's email
  onCommentAdded: (newComment: Comment) => void; 
}

const CommentSection: React.FC<CommentSectionProps> = ({
  post,
  authUserId,
  authUserEmail,
  onCommentAdded
}) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post("http://localhost:3000/comment", {
        content: newComment,
        postId: post._id,
        owner: authUserId,
        email: authUserEmail,
      });
      // The server should return the newly created comment object
      const createdComment: Comment = response.data;

      // Clear the input
      setNewComment("");

      // Notify parent so it can update the local post comments
      onCommentAdded(createdComment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      {post.comments?.length > 0 ? (
        post.comments.map((comment) => (
          <Box key={comment._id} sx={{ mb: 2 }}>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle2" color="text.primary">
              {comment.email} says:
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
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          onClick={handleAddComment}
          sx={{ mt: 1 }}
          variant="contained"
          disabled={!newComment.trim()}
        >
          Add Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentSection;