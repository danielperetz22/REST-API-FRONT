import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

interface PostProps {
  title: string;
  content: string;
  imageUrl?: string;
}

const Post: React.FC<PostProps> = ({ title, content, imageUrl }) => {
  return (
    <Card sx={{ maxWidth: 600, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
      {imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt="Post image"
          sx={{ borderRadius: "8px 8px 0 0", objectFit: "cover" }}
        />
      )}
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
