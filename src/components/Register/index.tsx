import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const defaultImage = "/src/assets/profile-default.jpg";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    try {
      const response = await axios.post("http://localhost:3000/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
  
      console.log("Registration Success:", response.data); 
      alert("User registered successfully!");
      navigate("/login"); 
    } catch (err: any) {
      if (err.response) {
    
        console.error("Error response:", err.response.data);
        setError(err.response.data.message || "Failed to register.");
      } else if (err.request) {
        
        console.error("No response received:", err.request);
        setError("No response from the server. Please try again later.");
      } else {
     
        console.error("Error during registration:", err.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/google", {
        token: credentialResponse.credential,
      });
  
      console.log("Google Login Success:", response.data); 
      alert("User registered successfully!");
      navigate("/login");
    } catch (err: any) {
      if (err.response) {
        console.error("Error response:", err.response.data);
        setError(err.response.data.message || "Google registration failed.");
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from the server. Please try again later.");
      } else {
        console.error("Error during Google registration:", err.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  const handleGoogleError = () => {
    console.error("Google Registration Failed");
    setError("Failed to register with Google.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Profile Image</label>
        <input type="file" id="profileImage" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <img
          src={previewImage || defaultImage}
          alt="Profile Preview"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      </div>
      <div>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
      <hr />
      <h3>Or register with Google</h3>
      <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};

export default Register;
