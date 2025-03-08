import React, { useState, useEffect } from "react";
import { apiClient } from "../../services/api_client";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Menu,
  MenuItem,
  TextField,
  Snackbar,
  Button,
  CardMedia,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import CommentSection from "./CommentSection";
import { useAuth } from "../../context/AuthContext";
import { getCorrectImageUrl } from "../../until/imageProfile";
import postService from "../../services/post_service";

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
  owner: string;
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const {
    userId: authUserId,
    userEmail: authUserEmail,
    userUsername: authUserUsername,
  } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get("/post/all");
        console.log("Fetched posts:", response.data);
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

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    postId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
    handleMenuClose();
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.put(`/post/${postId}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const updatedPost = response.data; 
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, ...updatedPost } 
            : post
        )
      );
      setEditingPostId(null);
    } catch (err) {
      console.error("❌ Error updating post:", err);
      setError("Failed to update post. Please try again.");
    }
  };
  

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleDelete = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      handleMenuClose();
      setSnackbarOpen(true);
    } catch (err) {
      console.error("❌ Error deleting post:", err);
    }
  };
  

  const handleGenerateAIEdit = async () => {
    if (!editTitle) {
      setError("Please enter a title before generating content.");
      return;
    }
    setLoadingAI(true);
    try {
      const aiContent = await postService.generateBookDescription(
        editTitle,
        "A social media post",
        "engaging"
      );
      setEditContent(aiContent);
    } catch (err) {
      console.error("AI Generation Error:", err);
      setError("Failed to generate AI content.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#F7F5F2", height: "100%", width: "100%" }}>
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

          {posts.length === 0 ? (
          <Typography>No posts available.</Typography>
        ) : (
          <Grid container spacing={5} justifyContent="center">
            {posts.map((post) => (
              <Grid item xs={12} sm={8} md={6} lg={6} key={post._id}>
                <Card sx={{ maxWidth: 700, mx: "auto", borderRadius: 2 }}>
                     <CardHeader
                       avatar={<Avatar src={getCorrectImageUrl(post.userProfileImage)} />}
                       title={
                         <Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold" }}>
                            {post.username}
                          </Typography>
                       }
                       subheader={
                         <Typography variant="body2" color="text.secondary">
                           {post.email}
                         </Typography>
                       }
                    action={
                      authUserId === post.owner && (
                        <>
                          <IconButton
                            aria-label="settings"
                            onClick={(event) => handleMenuClick(event, post._id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && selectedPostId === post._id}
                            onClose={handleMenuClose}
                          >
                            <MenuItem onClick={() => handleEditClick(post)}>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={() => handleDelete(post._id)}>
                              Delete
                            </MenuItem>
                          </Menu>
                        </>
                      )
                    }
                    />
                    <CardMedia
                    component="img"
                    height="350"
                    image={getCorrectImageUrl(post.image)}
                    alt={post.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    {editingPostId === post._id ? (
                      <>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Edit Title"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          variant="outlined"
                          label="Edit Content"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>

                          <Button variant="outlined" color="inherit" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleGenerateAIEdit}
                            disabled={loadingAI}
                          >
                            {loadingAI ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Generate with AI"
                            )}
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => handleSaveEdit(post._id)}
                          >
                            Save
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                        >
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.content.length > 200
                            ? `${post.content.substring(0, 200)}...`
                            : post.content}
                        </Typography>
                      </>
                    )}
                  </CardContent>

                  <CardActions disableSpacing>
                    {editingPostId !== post._id && (
                      <ExpandMore
                        expand={expandedPostId === post._id}
                        onClick={() => handleExpandClick(post._id)}
                        aria-expanded={expandedPostId === post._id}
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    )}
                  </CardActions>

                  <Collapse
                    in={expandedPostId === post._id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <CardContent>
                      {editingPostId !== post._id && (
                        <Box sx={{ borderRadius: 1 }}>
                          <CommentSection
                            post={post}
                            authUserId={authUserId || ""}
                            authUserEmail={authUserEmail || ""}
                            authUserUsername={authUserUsername || ""}
                            onCommentsUpdated={(updatedComments) => {
                              setPosts((prevPosts) =>
                                prevPosts.map((p) =>
                                  p._id === post._id
                                    ? { ...p, comments: updatedComments }
                                    : p
                                )
                              );
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Post was deleted successfully"
        />
      </Container>
    </Box>
  );
};

export default PostsList;
