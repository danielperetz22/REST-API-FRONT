import axios from "axios";

export const handleGoogleResponse = async (
  credential: string,
  navigate: (path: string) => void,
  setError: (msg: string | null) => void,
  login: (refreshToken: string, userId: string, userEmail: string, username: string, profileImage: string) => void 
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

    login(
      refreshToken,
      user._id,
      user.email,
      user.username || "Unknown", 
      user.profileImage || "https://example.com/default-avatar.jpg" 
    );

    alert(`Welcome, ${user.username || user.email}!`);
    navigate("/posts");
  } catch (err) {
    console.error("Error during Google login/register:", err);
    setError("Google login/register failed. Please try again.");
  }
};
