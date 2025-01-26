import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const defaultImage= "/src/assets/profile-default.jpg";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    console.log({
        username,
        email,
        password,
        profileImage: profileImage ? profileImage.name : defaultImage,
      });
    navigate("/login"); 
    alert("User registered successfully!");
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Google Registration Success:", credentialResponse);
    if (credentialResponse.credential) {
      console.log("Google Token:", credentialResponse.credential);
      navigate("/login"); // מפנה לדף התחברות לאחר הרשמה עם Google
    }
  };

  const handleGoogleError = () => {
    console.error("Google Registration Failed");
    setError("Failed to register with Google.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* הצגת הודעות שגיאה */}
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
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};

export default Register;
