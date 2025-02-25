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

    // ✅ Upload Google profile image to server
    const uploadedProfileImage = await uploadProfileImage(user._id, user.profileImage);

    // ✅ Fix profile image path for frontend
    const profileImageUrl = uploadedProfileImage
      ? `http://localhost:3000/uploads/${uploadedProfileImage}`
      : user.profileImage;

    console.log("Final Profile Image URL:", profileImageUrl);

    // Save user details in local storage
    localStorage.setItem("userProfileImage", profileImageUrl);

    // Pass all details to login function
    login(refreshToken, user._id, user.email, user.username, profileImageUrl);

    navigate("/posts");
  } catch (err) {
    console.error("Error during Google login/register:", err);
    setError("Google login/register failed. Please try again.");
  }
};

/**
 * Uploads a Google profile image to the server's `/uploads/` folder.
 */
const uploadProfileImage = async (userId: string, googleProfileImageUrl: string): Promise<string | null> => {
  try {
    // ✅ Download image
    const imageResponse = await axios.get(googleProfileImageUrl, { responseType: "blob" });

    // ✅ Create FormData for upload
    const formData = new FormData();
    formData.append("profileImage", imageResponse.data, "profile.jpg");

    // ✅ Upload image to server
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
