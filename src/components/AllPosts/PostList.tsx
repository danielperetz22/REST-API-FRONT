import { FC } from "react";
import usePosts from "../../hook/use_post";

const PostsList: FC = () => {
  const { posts, isLoading, error } = usePosts();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <img src={`http://localhost:3000/${post.image}`} alt={post.title} style={{ maxWidth: "300px" }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
