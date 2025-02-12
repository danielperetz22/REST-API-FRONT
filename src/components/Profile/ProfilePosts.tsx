import { FC, useState, useEffect } from "react";
import usePosts from "../../hook/use_post";
import { Container, Grid, Card, CardContent, Typography, CardMedia, CircularProgress, Alert, Button, Collapse, Box } from "@mui/material";
import axios from "axios";

const ProfilePosts: FC = () => {
  const { posts, isLoading, error } = usePosts();
  const [userId, setUserId] = useState<string | null>(null); 
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

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

  const filteredPosts = userId ? posts.filter(post => post.owner === userId) : []; 

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
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
      {filteredPosts.length === 0 ? (
        <Typography>No posts available.</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          {filteredPosts.map(post => (
            <Grid item xs={12} md={6} lg={6} key={post._id}>
              <Card sx={{ width: "100%", maxWidth: 500, mx: "auto", boxShadow: 4, borderRadius: 2, p: 2 }}>
                <CardMedia component="img" height="300" image={`http://localhost:3000/${post.image}`} alt={post.title} sx={{ objectFit: "cover", borderRadius: "8px 8px 0 0" }}/><CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}> {post.title} </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                  </Typography>
                </CardContent>
                <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setExpandedPostId(expandedPostId === post._id ? null : post._id)}
              >
                {expandedPostId === post._id ? "Hide Comments" : "Show Comments"}
              </Button>
                <Collapse in={expandedPostId === post._id}>
                  <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
                    {post.comments?.length > 0 ? (
                      post.comments.map((comment, index) => (
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
            </Grid>
          ))}
        </Grid>
        
      )}
    </Container>
  );
};

export default ProfilePosts;
