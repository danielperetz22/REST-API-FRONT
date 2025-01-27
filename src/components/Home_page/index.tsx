
import "./HomePage.css"; 
export const HomePage = () => {
  return (
    <div className="container">
      <h1 className="title">Welcome to Book Haven - the ultimate blog for book lovers!</h1>
      <h2 className="subtitle">
        Discover a space where you can:
        <ul>
          <li>📚 Share your favorite books.</li>
          <li>📝 Write personalized reviews and recommendations.</li>
          <li>📸 Upload images to bring your posts to life.</li>
        </ul>
        Whether you're an avid reader or just starting your literary journey, our platform lets you connect, inspire, and be inspired. Dive into the world of books and share your passion with a like-minded community.
        <br />
        <strong>Start your book blogging adventure today!</strong>
      </h2>
      <div className="button-container">
        <button className="btn register" onClick={() => alert("Go to Register Page")}>
          Register
        </button>
        <button className="btn login" onClick={() => alert("Go to Log In Page")}>
          Log In
        </button>
      </div>
    </div>
  );
};
