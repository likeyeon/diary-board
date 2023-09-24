import { useCallback } from "react";
import "../styles/detail.scss";
import { useNavigate } from "react-router-dom";
import notFound from "../assets/not-found.jpg";
import axios from "axios";

const PostDetail = ({
  id,
  title,
  content,
  created_at,
  updated_at,
  member_id,
}) => {
  const navigate = useNavigate();

  const moveToUpdate = () => {
    navigate(`/update/${id}`);
  };

  const deletePost = useCallback(async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      await axios.delete(`http://localhost:8080/posts/${id}`).then((res) => {
        alert("삭제되었습니다.");
        navigate("/posts");
      });
    }
  }, [id, navigate]);

  return (
    <div className="post-detail">
      <div className="post-detail__top">
        <h1 className="post-detail__title">{title}</h1>
        <div className="post-detail__info">
          <span className="post-detail__updated">{updated_at}</span>
          <span> | </span>
          <span className="post-detail__memeber">{member_id}</span>
        </div>
        <div className="post-detail__link">
          <button onClick={moveToUpdate}>수정</button>
          <button onClick={deletePost}>삭제</button>
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
