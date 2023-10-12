import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PostDetail from "../components/PostDetail";
import Comments from "../components/Comments";
import { useSelector } from "react-redux";

const DetailPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const accessToken = useSelector((state) => state.Auth.accessToken);

  const getPost = async () => {
    try {
      const config = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined;
      const response = await axios.get(`/posts/${id}`, config);
      if (response.status === 200) {
        setPost(response.data);
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
        console.log(error);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <PostDetail
        id={post.id}
        title={post.title}
        content={post.content}
        created_at={post.created_at}
        updated_at={post.updated_at}
        author={post.author}
        heart_count={post.heart_count}
        is_hearted={post.is_hearted}
      />
      <Comments id={post.id} commentList={post.comments} />
    </>
  );
};

export default DetailPost;
