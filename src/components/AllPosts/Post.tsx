import React, { useState } from "react";
import { Card, CardContent, Typography, CardMedia, Button, Collapse, Box } from "@mui/material";

interface PostProps {
  title: string;
  content: string;
  imageUrl?: string;
  comments?: string[];
}

const Post: React.FC<PostProps> = ({ title, content, imageUrl, comments = [] }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card sx={{ maxWidth: 800, width: "100%", mx: "auto", boxShadow: 4, borderRadius: 2, p: 2 }}>
      {imageUrl && (
        <CardMedia
          component="img"
          height="250"
          image={imageUrl}
          alt="Post image"
          sx={{ objectFit: "cover", borderRadius: "8px 8px 0 0" }}
        />
      )}
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {content}
        </Typography>
      </CardContent>
      {/* Button to toggle comments */}
      <Button
        variant="contained"
        sx={{ m: 2 }}
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </Button>
      {/* Comments Section */}
      <Collapse in={showComments}>
        <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                - {comment}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments yet.
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default Post;
