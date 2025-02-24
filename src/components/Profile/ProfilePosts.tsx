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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CommentSection from "..//AllPosts/CommentSection";
import { useAuth } from "../../context/AuthContext";

const ExpandMore = styled(IconButton)<{ expand: boolean }>(
  ({ theme, expand }) => ({
    transform: expand ? "rotate(180deg)" : "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  })
);

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

  const {
    userId: authUserId,
    userEmail: authUserEmail,
    userUsername: authUserUsername,
  } = useAuth();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/post/all");
        const allPosts: Post[] = response.data;
        const userPosts = allPosts.filter((post) => post.owner === authUserId);

        setPosts(userPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserPosts();
  }, [authUserId]);

  const handleExpandClick = (postId: string) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
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

  const handleDelete = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/post/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      handleMenuClose();
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
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
      await axios.put(
        `http://localhost:3000/post/${postId}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, title: editTitle, content: editContent }
            : post
        )
      );
      setEditingPostId(null);
    } catch (err) {
      console.error("Error updating post:", err);
    }
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

      {posts.length === 0 ? (
        <Typography>No posts available.</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={post._id}>
              <Card sx={{ maxWidth: 500, mx: "auto", borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    post.userProfileImage && (
                      <Avatar
                        src={`http://localhost:3000/${post.userProfileImage}`}
                      >
                        {post.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    )
                  }
                  title={
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{ fontWeight: "bold" }}
                    >
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
                          open={
                            Boolean(anchorEl) && selectedPostId === post._id
                          }
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
                  image={`http://localhost:3000/${post.image}`}
                  alt={post.title}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent>
                  {/* Toggle between edit mode and view mode */}
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <button onClick={() => handleSaveEdit(post._id)}>
                          Save
                        </button>
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
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "#f9f9f9",
                          borderRadius: 1,
                          mt: 2,
                        }}
                      >
                        <Typography variant="h6">Comments</Typography>
                        <CommentSection
                          post={post}
                          authUserId={authUserId || ""}
                          authUserEmail={authUserEmail || ""}
                          authUserUsername={authUserUsername || ""}
                          onCommentAdded={(newComment) =>
                            handleCommentAdded(post._id, {
                              ...newComment,
                              username: authUserUsername || "",
                            })
                          }
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
  );
};

export default UserPosts;
