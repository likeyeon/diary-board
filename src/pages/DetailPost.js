import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PostDetail from "../components/PostDetail";
import Comments from "../components/Comments";

const DetailPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});

  const getPost = async () => {
    try {
      const response = await axios.get(`${id}`);
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
      />
      <Comments id={post.id} commentList={post.comments} />
    </>
  );
};

export default DetailPost;
