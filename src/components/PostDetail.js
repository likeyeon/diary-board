import React from "react";
import "../styles/detail.scss";
import notFound from "../assets/not-found.jpg";

const PostDetail = ({ id, title, content, updated_at, member_id }) => {
  return (
    <div className="post-detail">
      <div className="post-detail__top">
        <h1 className="post-detail__title">{title}</h1>
        <div className="post-detail__info">
          <span className="post-detail__updated">{updated_at}</span>
          <span> | </span>
          <span className="post-detail__memeber">{member_id}</span>
        </div>
      </div>
      <div className="post-detail__bottom">
        <img className="post-detail__img" src={notFound} alt="notFound" />
        <p className="post-detail__content">{content}</p>
      </div>
    </div>
  );
};

export default PostDetail;
