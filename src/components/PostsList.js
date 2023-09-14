import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/post-list.scss";
import notFound from "../assets/not-found.jpg";

const PostsList = () => {
  const [postsList, setPostsList] = useState([]);

  const getPostsList = async () => {
    const res = await axios.get("http://localhost:8080/posts");
    setPostsList(res.data);
    console.log(postsList);
    return res.data;
  };

  useEffect(() => {
    getPostsList();
  }, []);

  return (
    <div className="post-list-wrapper">
      <ul className="post-list">
        {postsList.map((post) => (
          <Link to={`/posts/${post.id}`}>
            <li
              key={post.id}
              className="post-list-item"
              style={{ textDecoration: "none" }}
            >
              <img
                className="post-list-item__img"
                src={notFound}
                alt="notFound"
              />

              <div className="post-list-item__top">
                <div className="post-list-item__updated">{post.updated_at}</div>
                <div className="post-list-item__text">
                  <Link
                    to={`/posts/${post.id}`}
                    className="post-list-item__title"
                  >
                    {post.title}
                  </Link>
                  <p className="post-list-item__content">{post.content}</p>
                </div>
              </div>
              <div className="post-list-item__bottom">
                <span className="post-list-item__member">{post.member_id}</span>
                <span className="post-list-item__likes">🖤 2</span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
