import { apiClient } from "../services/api_client";


export const handleGoogleResponse = async (
  credential: string,
  navigate: (path: string) => void,
  setError: (msg: string | null) => void,
  login: (refreshToken: string, userId: string, userEmail: string, userUsername: string, userProfileImage: string) => void 
) => {
  try {
    const response = await apiClient.post("/auth/google", {

      token: credential,
    });

    const { accessToken, refreshToken, user } = response.data;

    if (!accessToken || !refreshToken || !user._id || !user.email || !user.username || !user.profileImage) {
      setError("Google login failed. Missing credentials.");
      return;
    }

    console.log("Google Login/Register Success:", user);

    localStorage.setItem("userUsername", user.username);
    localStorage.setItem("userProfileImage", user.profileImage);

    login(refreshToken, user._id, user.email, user.username, user.profileImage);

    alert(`Welcome, ${user.username}!`);
    navigate("/posts");
  } catch (err) {
    console.error("Error during Google login/register:", err);
    setError("Google login/register failed. Please try again.");
  }
};
