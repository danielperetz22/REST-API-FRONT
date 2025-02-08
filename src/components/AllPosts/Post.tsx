import React, { useState } from "react";
import { Card, CardContent, Typography, Button, TextField, Box, Collapse } from "@mui/material";

interface PostProps {
  title: string;
  content: string;
  imageUrl?: string;
  comments?: string[];
}

const Post: React.FC<PostProps> = ({ title, content, imageUrl, comments = [] }) => {
  const [commentList, setCommentList] = useState<string[]>(comments); // שמירת התגובות
  const [newComment, setNewComment] = useState<string>(""); // התגובה שהמשתמש מקליד
  const [showComments, setShowComments] = useState(false); // מציג/מסתיר תגובות
  const [isAddingComment, setIsAddingComment] = useState(false); // מציג טופס הוספת תגובה

  const handleAddComment = () => {
    if (newComment.trim() === "") return; // מניעת הוספת תגובה ריקה
    setCommentList([...commentList, newComment]); // הוספת התגובה לרשימה
    setNewComment(""); // איפוס השדה
    setIsAddingComment(false); // סגירת הטופס לאחר שליחה
  };

  return (
    <Card sx={{ maxWidth: 800, width: "100%", mx: "auto", boxShadow: 4, borderRadius: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {content}
        </Typography>
      </CardContent>

      {/* כפתור להצגת תגובות */}
      <Button variant="contained" sx={{ m: 2 }} onClick={() => setShowComments(!showComments)}>
        {showComments ? "הסתר תגובות" : "הצג תגובות"}
      </Button>

      {/* כפתור לפתיחת טופס הוספת תגובה */}
      <Button variant="outlined" sx={{ m: 2 }} onClick={() => setIsAddingComment(true)}>
        הוסף תגובה
      </Button>

      {/* טופס הוספת תגובה */}
      <Collapse in={isAddingComment}>
        <Box sx={{ display: "flex", gap: 1, p: 2 }}>
          <TextField
            fullWidth
            label="הקלד תגובה..."
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddComment}>
            שלח
          </Button>
        </Box>
      </Collapse>

      {/* רשימת תגובות */}
      <Collapse in={showComments}>
        <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
          {commentList.length > 0 ? (
            commentList.map((comment, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                - {comment}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              אין תגובות עדיין.
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default Post;
