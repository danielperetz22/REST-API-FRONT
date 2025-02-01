import { FC } from "react";
import usePosts from "../../hook/use_post";
import { Container, Grid, Card, CardContent, Typography, CardMedia, CircularProgress, Alert } from "@mui/material";

const PostsList: FC = () => {
  const { posts, isLoading, error } = usePosts();

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
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
              {post.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`${import.meta.env.VITE_API_BASE_URL}/${post.image}`}
                  alt={post.title}
                  sx={{ objectFit: "cover" }}
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostsList;
