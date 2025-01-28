import { useEffect, useState } from "react";
import axios from "axios";


interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
}

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>("http://localhost:3000/post/all");
        setPosts(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, isLoading, error };
};

export default usePosts;
