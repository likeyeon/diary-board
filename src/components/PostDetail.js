import { useCallback } from "react";
import "../styles/detail.scss";
import { useNavigate, Link } from "react-router-dom";
import notFound from "../assets/not-found.jpg";
import axios from "axios";
import chevronLeft from "../assets/chevron-left.svg";
import verticalLine from "../assets/verticalLine.svg";

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
    <div className="postDetail">
      <div className="postDetail-link">
        <div className="postDetail-link__previous">
          <img
            className="postDetail-link__previous--icon"
            src={chevronLeft}
            alt="chevron-left"
          />
          <Link to={"/posts"} className="postDetail-link__previous--text">
            홈으로
          </Link>
        </div>
        <div className="postDetail-link__btn">
          <button
            className="postDetail-link__btn--update"
            onClick={moveToUpdate}
          >
            수정
          </button>
          <button className="postDetail-link__btn--delete" onClick={deletePost}>
            삭제
          </button>
        </div>
      </div>
      <div className="postDetail-contents">
        <div className="postDetail-contents__top">
          <h1 className="postDetail-contents__title">{title}</h1>
          <div className="postDetail-contents__info">
            <span className="postDetail-contents__info--updated">
              {updated_at}
            </span>
            <span>
              <img src={verticalLine} alt="vertical-line" />
            </span>
            <span className="postDetail-contents__info--memeber">
              {member_id}
            </span>
          </div>
        </div>
        <div className="postDetail-contents__bottom">
          <img
            className="postDetail-contents__img"
            src={notFound}
            alt="notFound"
          />
          <p className="postDetail-contents__content">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
