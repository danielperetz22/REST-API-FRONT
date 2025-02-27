import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CommentSection from "./CommentSection";
import { useAuth } from "../../context/AuthContext";
import {getCorrectImageUrl} from "../../until/imageProfile";

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "expand", 
})<{ expand: boolean }>(({ theme, expand }) => ({
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Comment {
  _id?: string;
  content: string;
  email: string;
  username: string;
  owner: string;
  postId: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  email: string;
  userProfileImage: string;
  username: string;
  image: string;
  comments: Comment[];
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const { userId: authUserId, userEmail: authUserEmail, userUsername:authUserUsername } = useAuth();

  useEffect(() => {
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
    <Container sx={{ mt: 16, mb: 4 }}>
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
          <Grid item xs={12} sm={6} md={4} lg={4} key={post._id}>
            <Card sx={{ maxWidth: 500, mx: "auto", borderRadius: 2 }}>
            <CardHeader
                 avatar={
                   <Avatar
                      src={getCorrectImageUrl(post.userProfileImage)}
                     sx={{ height: 44, width: 44 }}
                    >
                      {post.username && post.username.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={post.username}
                  subheader={post.email}
                  titleTypographyProps={{
                    variant: "h6",
                    sx: { fontWeight: "bold" },
                  }}
                  subheaderTypographyProps={{
                    variant: "body2",
                    color: "text.secondary",
                  }}
                  />
              <CardMedia
                component="img"
                height="350"
                image={getCorrectImageUrl(post.image)}
                alt={post.title}
                sx={{ objectFit: "-moz-initial" }}
              />
              <CardContent>
              <Typography variant="subtitle2" color="textSecondary" sx={{fontWeight: "bold", fontSize: "1.1rem"}}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <ExpandMore
                  expand={expandedPostId === post._id}
                  onClick={() => handleExpandClick(post._id)}
                  aria-expanded={expandedPostId === post._id} theme={undefined}            >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse in={expandedPostId === post._id} timeout="auto" unmountOnExit>
                <CardContent>
                    <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1, mt: 2 }}>
                    <Typography variant="h6">Comments</Typography>
                    <CommentSection
                      post={post}
                      authUserId={authUserId || ""}
                      authUserUsername={authUserUsername || ""}
                      authUserEmail={authUserEmail || ""}
                      onCommentAdded={(newComment) => handleCommentAdded(post._id, { ...newComment, username: authUserUsername || "" })}
                    />
                    </Box>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostsList;