import React, { useState } from "react";
import { Box, Typography, TextField, Button, Divider, Stack, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

interface Comment {
  _id?: string;
  content: string;
  email: string;
  owner: string;
  username: string;
  postId: string;
}

interface PostType {
  _id: string;
  title: string;
  content: string;
  image: string;
  email: string;
  comments: Comment[];
}

interface CommentSectionProps {
  post: PostType;
  authUserId: string;
  authUserEmail: string;
  authUserUsername: string;
  onCommentsUpdated: (updatedComments: Comment[]) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  post,
  authUserId,
  authUserEmail,
  authUserUsername,
  onCommentsUpdated,
}) => {
  const [newComment, setNewComment] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/comment",
        {
          content: newComment,
          postId: post._id,
          owner: authUserId,
          email: authUserEmail,
          username: authUserUsername,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdComment: Comment = response.data.newComment;
      setNewComment("");
      onCommentsUpdated([...post.comments, createdComment]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  /**
   * התחלת עריכת תגובה
   */
  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment._id!);
    setEditedContent(comment.content);
  };

  /**
   * עדכון תגובה
   */
  const handleSaveEdit = async (commentId: string) => {
    if (!editedContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/comment/${commentId}`,
        { comment: editedContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedComment: Comment = response.data.comment;
      const updatedComments = post.comments.map((c) =>
        c._id === updatedComment._id ? updatedComment : c
      );

      onCommentsUpdated(updatedComments);
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  /**
   * ביטול עריכת תגובה
   */
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  /**
   * מחיקת תגובה
   */
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      await axios.delete(`http://localhost:3000/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedComments = post.comments.filter((c) => c._id !== commentId);
      onCommentsUpdated(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {post.comments.length > 0 ? (
        post.comments.map((comment) => (
          <Box key={comment._id} sx={{ mb: 2, p: 1, borderRadius: 1, border: "1px solid #ddd" }}>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle2" color="text.primary">
              {comment.username} ({comment.email}):
            </Typography>

            {editingCommentId === comment._id ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <IconButton color="success" onClick={() => handleSaveEdit(comment._id!)}>
                  <CheckIcon />
                </IconButton>
                <IconButton color="error" onClick={handleCancelEdit}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {comment.content}
              </Typography>
            )}

            {comment.owner === authUserId && !editingCommentId && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <IconButton color="primary" onClick={() => handleStartEdit(comment)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteComment(comment._id!)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            )}
          </Box>
        ))
      ) : (
        <Typography>No comments yet.</Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            size="small"
          />
          <Button
            onClick={handleAddComment}
            variant="outlined"
            disabled={!newComment.trim()}
            sx={{ whiteSpace: "nowrap", height: "100%" }}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CommentSection;
