import axios from "axios";

export const handleGoogleResponse = async (
  credential: string,
  navigate: (path: string) => void,
  setError: (msg: string | null) => void,
  login: (refreshToken: string, userId: string, userEmail: string, userUsername: string, userProfileImage: string) => void
) => {
  try {
    const response = await axios.post("http://localhost:3000/auth/google", {
      token: credential,
    });

    const { accessToken, refreshToken, user } = response.data;

    if (!accessToken || !refreshToken || !user._id || !user.email || !user.username || !user.profileImage) {
      setError("Google login failed. Missing credentials.");
      return;
    }

    console.log("Google Profile Image from API:", user.profileImage);

    const uploadedProfileImage = await uploadProfileImage(user._id, user.profileImage);

    const profileImageUrl = uploadedProfileImage
      ? `http://localhost:3000/uploads/${uploadedProfileImage}`
      : user.profileImage;

    console.log("Final Profile Image URL:", profileImageUrl);

    localStorage.setItem("userProfileImage", profileImageUrl);

    login(refreshToken, user._id, user.email, user.username, profileImageUrl);

    navigate("/posts");
  } catch (err) {
    console.error("Error during Google login/register:", err);
    setError("Google login/register failed. Please try again.");
  }
};

const uploadProfileImage = async (_userId: string, googleProfileImageUrl: string): Promise<string | null> => {
  try {
    const imageResponse = await axios.get(googleProfileImageUrl, { responseType: "blob" });

    const formData = new FormData();
    formData.append("profileImage", imageResponse.data, "profile.jpg");

    const uploadResponse = await axios.put(`http://localhost:3000/auth/profile`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Uploaded Profile Image:", uploadResponse.data);

    return uploadResponse.data.user.profileImage; 
  } catch (err) {
    console.error("Error uploading Google profile image:", err);
    return null;
  }
};
