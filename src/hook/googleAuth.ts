import axios from "axios";

export const handleGoogleResponse = async (
  credential: string,
  navigate: (path: string) => void,
  setError: (msg: string | null) => void,
  login: (refreshToken: string, userId: string, userEmail: string, userUsername: string, userProfileImage: string) => void // Added username & profileImage
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

    console.log("Google Login/Register Success:", user);

    // Save user details in local storage
    localStorage.setItem("userUsername", user.username);
    localStorage.setItem("userProfileImage", user.profileImage);

    // Pass all details to login function
    login(refreshToken, user._id, user.email, user.username, user.profileImage);

    alert(`Welcome, ${user.username}!`);
    navigate("/posts");
  } catch (err) {
    console.error("Error during Google login/register:", err);
    setError("Google login/register failed. Please try again.");
  }
};
