import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CircularProgress,
  Alert,
  Button,
  Collapse,
  Box,
} from "@mui/material";
import axios from "axios";
import CommentSection from "./CommentSection";
import { useAuth } from "../../context/AuthContext"; 

// Types for posts & comments
interface Comment {
  _id?: string;
  content: string;
  email: string;
  owner: string;
  postId: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  email: string;  // who created the post
  image: string;
  comments: Comment[];
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Get user info from AuthContext
  const { userId: authUserId, userEmail: authUserEmail } = useAuth();

  useEffect(() => {
    // Fetch posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/post/all");
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleExpandClick = (postId: string) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
  };

  // Called by CommentSection after a new comment is created
  const handleCommentAdded = (postId: string, newComment: Comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  return (
    <Container sx={{ mt: 4 }}>
      {isLoading && (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3} justifyContent="center">
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={6} key={post._id}>
            <Card
              sx={{
                width: "100%",
                maxWidth: 500,
                mx: "auto",
                boxShadow: 4,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                p: 2,
              }}
            >
              {/* Post Cover Image */}
              <CardMedia
                component="img"
                height="300"
                image={`http://localhost:3000/${post.image}`}
                alt={post.title}
                sx={{
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />

              {/* Main Content */}
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  {post.title}
                </Typography>
                {/* Show the author’s email (the post creator) */}
                <Typography variant="subtitle2" sx={{ my: 1 }}>
                  Created by: {post.email}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {post.content.length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content}
                </Typography>
              </CardContent>

              {/* Toggle Comments */}
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleExpandClick(post._id)}
              >
                {expandedPostId === post._id ? "Hide Comments" : "Show Comments"}
              </Button>

              <Collapse in={expandedPostId === post._id}>
                <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
                  <CommentSection
                    post={post}
                    authUserId={authUserId || ""}
                    authUserEmail={authUserEmail || ""}
                    onCommentAdded={(newComment) => {
                      handleCommentAdded(post._id, newComment);
                    }}
                  />
                </Box>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostsList;