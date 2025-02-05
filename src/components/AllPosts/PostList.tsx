import { FC, useState } from "react";
import usePosts from "../../hook/use_post";
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

const PostsList: FC = () => {
  const { posts, isLoading, error } = usePosts();
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  return (
    <Container sx={{ mt: 4, marginTop: 16 }}>
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
          <Grid item xs={12} key={post._id}> {/* Ensure one card per row */}
            <Card sx={{ 
              width: "100%", 
              maxWidth: 500,  // Set card width to resemble a book
              mx: "auto", 
              boxShadow: 4, 
              borderRadius: 2, 
              display: "flex", 
              flexDirection: "column",
              textAlign: "center",
              p: 2 
            }}>
              
              {/* Book Cover Image */}
              <CardMedia
                component="img"
                height="300" // Taller image for book cover feel
                image={`http://localhost:3000/${post.image}`} 
                alt={post.title}
                sx={{ 
                  objectFit: "cover", 
                  borderRadius: "8px 8px 0 0" // Rounded top corners like a book
                }}
              />

              <CardContent>
                {/* Book Title */}
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  {post.title}
                </Typography>

                {/* Book Description */}
                <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                </Typography>
              </CardContent>

              {/* Show/Hide Comments Button */}
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setExpandedPostId(expandedPostId === post._id ? null : post._id)}
              >
                {expandedPostId === post._id ? "Hide Comments" : "Show Comments"}
              </Button>

              {/* Comments Section */}
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
    </Container>
  );
};

export default PostsList;
