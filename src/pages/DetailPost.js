import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PostDetail from "../components/PostDetail";
import Comments from "../components/Comments";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { isLogin } from "../utils/jwtUtils";

const DetailPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const accessToken = useSelector((state) => state.Auth.accessToken);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = isLoggedIn
          ? await api.get(`/posts/${id}`)
          : await axios.get(process.env.REACT_APP_DB_HOST + `/posts/${id}`);
        if (response.status === 200) {
          console.log("response success");
          console.log(response);
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
    isLogin(accessToken) ? setisLoggedIn(true) : setisLoggedIn(false);
    getPost();
  }, [accessToken, id, isLoggedIn]);

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
        image={post.image}
      />
      <Comments id={post.id} commentList={post.comments} />
    </>
  );
};

export default DetailPost;
