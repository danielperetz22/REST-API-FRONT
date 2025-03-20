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
  TextField,
  Menu,
  MenuItem,
  Snackbar,
  Button,
  Pagination
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import CommentSection from "..//AllPosts/CommentSection";
import { useAuth } from "../../context/AuthContext";
import { getCorrectImageUrl } from "../../until/imageProfile";
import postService from "../../services/post_service";
import { apiClient } from "../../services/api_client";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "expand"
})<{ expand: boolean }>(({ theme, expand }) => ({
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest
  })
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
  likes: string[];
}

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const { userId: authUserId, userEmail: authUserEmail, userUsername: authUserUsername } = useAuth();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await apiClient.get("/post/all");
        const allPosts: Post[] = response.data;
        const userPosts = allPosts.filter((post) => post.owner.toString() === authUserId);
        setPosts(userPosts);
      } catch {
        setError("Failed to fetch posts.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserPosts();
  }, [authUserId]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (_: React.ChangeEvent<unknown>, pageValue: number) => {
    setCurrentPage(pageValue);
  };

  const handleExpandClick = (postId: string) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await apiClient.delete(`/post/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      handleMenuClose();
      setSnackbarOpen(true);
    } catch {
      setError("Failed to delete post.");
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleSaveEdit = async (postId: string) => {
    if (!editTitle.trim() || !editContent.trim()) {
      setError("Please fill out both title and content.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await apiClient.put(
        `/post/${postId}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, title: response.data.title, content: response.data.content } : post
        )
      );
      setEditingPostId(null);
    } catch {
      setError("Failed to update post.");
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, postId: string) => {
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

  const handleGenerateAIEdit = async () => {
    if (!editTitle) {
      setError("Please enter a title before generating content.");
      return;
    }
    setLoadingAI(true);
    try {
      const aiContent = await postService.generateBookDescription(editTitle, "A social media post", "engaging");
      setEditContent(aiContent);
    } catch {
      setError("Failed to generate AI content.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleLikeClick = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const postIndex = posts.findIndex((p) => p._id === postId);
      if (postIndex === -1) return;
      const post = posts[postIndex];
      const isLiked = post.likes.includes(authUserId || "");
      const updatedLikes = isLiked
        ? post.likes.filter((id) => id !== authUserId)
        : [...post.likes, authUserId || ""];
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = { ...post, likes: updatedLikes };
      setPosts(updatedPosts);
      const endpoint = `/post/${postId}/${isLiked ? "unlike" : "like"}`;
      const response = await apiClient.put(endpoint, {}, { headers: { Authorization: `Bearer ${token}` }});
      updatedPosts[postIndex] = response.data;
      setPosts(updatedPosts);
    } catch {
      setError("Failed to like/unlike post. Please try again.");
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {isLoading && (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {posts.length === 0 ? (
        <Typography>No posts available.</Typography>
      ) : (
        <>
          <Grid container spacing={5} justifyContent="center">
            {currentPosts.map((post) => (
              <Grid item xs={12} sm={8} md={6} lg={6} key={post._id}>
                <Card sx={{ maxWidth: 700, mx: "auto", borderRadius: 2 }}>
                  <CardHeader
                    avatar={<Avatar src={getCorrectImageUrl(post.userProfileImage)} />}
                    title={<Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold" }}>{post.username}</Typography>}
                    subheader={<Typography variant="body2" color="text.secondary">{post.email}</Typography>}
                    action={
                      authUserId === post.owner && (
                        <>
                          <IconButton aria-label="settings" onClick={(e) => handleMenuClick(e, post._id)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && selectedPostId === post._id}
                            onClose={handleMenuClose}
                          >
                            <MenuItem onClick={() => handleEditClick(post)}>Edit</MenuItem>
                            <MenuItem onClick={() => handleDelete(post._id)}>Delete</MenuItem>
                          </Menu>
                        </>
                      )
                    }
                  />
                  <CardMedia
                    component="img"
                    height="350"
                    image={post.image.startsWith("http") ? post.image : getCorrectImageUrl(post.image)}
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
                          <Button variant="outlined" color="inherit" onClick={handleCancelEdit}>Cancel</Button>
                          <Button variant="outlined" onClick={handleGenerateAIEdit} disabled={loadingAI}>
                            {loadingAI ? <CircularProgress size={24} color="inherit" /> : "Generate with AI"}
                          </Button>
                          <Button variant="contained" onClick={() => handleSaveEdit(post._id)}>Save</Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>{post.title}</Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ minHeight:100,maxHeight: 100, overflowY: "auto", scrollBehavior: "smooth",scrollbarWidth: "thin", '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#bbb', borderRadius: '4px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' } }}
                          >
                            {post.content}
                          </Typography>
                      </>
                    )}
                  </CardContent>
                  <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites" onClick={() => handleLikeClick(post._id)}>
                        {post.likes.includes(authUserId || "") ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                        <Typography variant="body2" sx={{ ml: 0.5,color: "#555",fontWeight:"bold" }}>{post.likes.length}</Typography>
                      </IconButton>

                      {editingPostId !== post._id && (
                        <Box sx={{ display: "flex", alignItems: "center", ml: "auto", gap: 0.5 }}>
                          <Typography sx={{color: "#555",fontWeight:"bold"}} variant="body2">{post.comments.length} Comments</Typography>
                          <ExpandMore
                            expand={expandedPostId === post._id}
                            onClick={() => handleExpandClick(post._id)}
                            aria-expanded={expandedPostId === post._id}
                          >
                            <ExpandMoreIcon />
                          </ExpandMore>
                        </Box>
                      )}
                    </CardActions>
                  <Collapse in={expandedPostId === post._id} timeout="auto" unmountOnExit>
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
                                prevPosts.map((p) => (p._id === post._id ? { ...p, comments: updatedComments } : p))
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
          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Pagination
              count={Math.ceil(posts.length / postsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Grid>
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Post was deleted successfully"
      />
    </Container>
  );
};
export default UserPosts;
