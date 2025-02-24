import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, TextField, Box, Collapse } from "@mui/material";
import axios from "axios";

interface Comment {
  content: string;
  owner: string;
  email: string;
}

interface PostProps {
  email: string;
  username: string;
  title: string;
  content: string;
  imageUrl?: string;
  postId: string;
}

const Post: React.FC<PostProps> = ({  title, content, imageUrl, postId }) => {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('/api/comments?postId=${postId}');
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
      const response = await axios.post('/api/comments', {
      });
      setCommentList((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
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