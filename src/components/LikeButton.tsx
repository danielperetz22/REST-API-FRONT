import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import apiClient from "../services/api_client"; 

interface LikeButtonProps {
  postId: string;
  isInitiallyLiked: boolean;
  likeCount: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  isInitiallyLiked,
  likeCount,
}) => {
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [likes, setLikes] = useState(likeCount);

  console.log(postId, isInitiallyLiked, likeCount);
  console.log("🔍 Checking post ID before like:", postId);
console.log("🔍 Request type:", isLiked ? " /post/:id/unlike" : " /post/:id/like");


  const toggleLike = async () => {
    console.log("Toggling like for post ID:", postId);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      // שימוש ב-apiClient ישירות מתוך הקומפוננטה
      const endpoint = `/post/${postId}/${isLiked ? "unlike" : "like"}`;

      const response = await apiClient.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(isLiked ? "Unliked post response:" : "Liked post response:", response);

      // עדכון ספירת לייקים
      setLikes(response.data.likes.length);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} post:`, error);
    }
  };

  return (
    <IconButton onClick={toggleLike} color={isLiked ? "error" : "default"}>
      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      <Typography variant="body2" sx={{ ml: 0.5 }}>
        {likes}
      </Typography>
    </IconButton>
  );
};

export default LikeButton;
