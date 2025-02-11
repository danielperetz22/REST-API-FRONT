
import axios from "axios";
export const handleGoogleResponse = async (
  credential: string,
  navigate: (path: string) => void,
  setError: (msg: string | null) => void,
  login: (refreshToken: string, userId: string, userEmail: string) => void // שלושה פרמטרים
) => {
  try {
    const response = await axios.post("http://localhost:3000/auth/google", {
      token: credential,
    });

    const { accessToken, refreshToken, user } = response.data;

    if (!accessToken || !refreshToken || !user._id || !user.email) {
      setError("Google login failed. Missing credentials.");
      return;
    }

    console.log("Google Login/Register Success:", user);

    // מעביר שלושה פרמטרים כמו שצריך
    login(refreshToken, user._id, user.email);

    alert(`Welcome, ${user.email}!`);
    navigate("/posts");
  } catch (err) {
    console.error("Error during Google login/register:", err);
    setError("Google login/register failed. Please try again.");
  }
};