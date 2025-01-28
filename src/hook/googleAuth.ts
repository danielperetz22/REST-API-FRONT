import axios from "axios";

export const handleGoogleResponse = async (
  credential: string,
  navigate: (path: string) => void,
  setError: (msg: string | null) => void
) => {
  try {
    const response = await axios.post("http://localhost:3000/auth/google", {
      token: credential,
    });

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    console.log("Google Login/Register Success:", user);
    alert(`Welcome, ${user.username}!`);

    navigate("/");
  } catch (err) {
    console.error("Error during Google login/register:", err);
    setError("Google login/register failed. Please try again.");
  }
};
