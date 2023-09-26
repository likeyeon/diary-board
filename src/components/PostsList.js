import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/post-list.scss";
import notFound from "../assets/not-found.jpg";
const PostsList = () => {
  const [postsList, setPostsList] = useState([]);

  const getPostsList = async () => {
    const res = await axios.get(
      `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}/posts`
    );
    setPostsList(res.data);
    return res.data;
  };

  useEffect(() => {
    getPostsList();
  }, []);

  return (
    <div className="post-list-wrapper">
      <ul className="post-list">
        {postsList.map((post) => (
          <div key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <li className="post-list-item" style={{ textDecoration: "none" }}>
                <img
                  className="post-list-item__img"
                  src={notFound}
                  alt="notFound"
                />

                <div className="post-list-item__top">
                  <div className="post-list-item__updated">
                    {post.updated_at}
                  </div>
                  <div className="post-list-item__text">
                    <div
                      to={`/posts/${post.id}`}
                      className="post-list-item__title"
                    >
                      {post.title}
                    </div>
                    <p className="post-list-item__content">{post.content}</p>
                  </div>
                </div>
                <div className="post-list-item__bottom">
                  <span className="post-list-item__member">
                    {post.member_id}
                  </span>
                  <span className="post-list-item__likes">🖤 2</span>
                </div>
              </li>
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
