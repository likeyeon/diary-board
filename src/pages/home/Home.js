import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const res = await axios.get("http://localhost:8080/posts");
      console.log(res.data);
      return res.data;
    };
    getPosts().then((res) => setPosts(res));
  }, []);

  return (
    <>
      <div>
        <ul>
          {posts &&
            posts.map((post, idx) => (
              <li key={post.id}>
                {post.title}
                {post.member_id}
                {post.content}
                {post.created_at}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default Home;
