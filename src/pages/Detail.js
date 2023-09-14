import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PostDetail from "../components/PostDetail";

const Detail = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});

  const getPost = async () => {
    const res = await axios.get(`http://localhost:8080/posts/${id}`);
    setPost(res.data);
    console.log(post);
    return res.data;
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <PostDetail
      id={post.id}
      title={post.title}
      content={post.content}
      updated_at={post.updated_at}
      member_id={post.member_id}
    />
  );
};

export default Detail;
