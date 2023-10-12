import { useEffect, useCallback, useState } from "react";
import menu from "../assets/menu-kebab.svg";
import heart from "../assets/heart.svg";
import heartFill from "../assets/heart-fill.svg";
import verticalLine from "../assets/verticalLine.svg";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { isLogin } from "../utils/jwtUtils";

const CommentItem = ({
  comment_id,
  author,
  content,
  modified_at,
  userNickname,
  updateComment,
  deleteComment,
  heart_count,
  is_hearted,
}) => {
  const [modal, setModal] = useState(false);
  const [modify, setModify] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const [heartCount, setHeartCount] = useState(heart_count);
  const [isLiked, setIsLiked] = useState(false);

  const accessToken = useSelector((state) => state.Auth.accessToken);

  useEffect(() => {
    // 댓글 작성자와 로그인한 사용자의 닉네임이 같은지 비교
    if (userNickname === author) setIsAuthor(true);
    setHeartCount(heart_count);
    setIsLiked(is_hearted);
  }, [userNickname, author, heart_count, is_hearted]);

  const handleSubmit = (e) => {
    updateComment(comment_id, newContent);
    setModify(false);
  };

  const handleDelete = (e) => {
    deleteComment(comment_id);
    setModal(false);
  };

  /* 하트 수 함수 */
  const handleHeartCount = useCallback(
    (operation) => {
      setHeartCount(heartCount + operation);
      setIsLiked(!isLiked);
    },
    [heartCount, isLiked]
  );

  /* 댓글 좋아요 post */
  const likeComment = useCallback(async () => {
    try {
      if (!isLogin(accessToken)) {
        alert("로그인이 필요한 기능입니다");
      } else {
        await api.post("/hearts", {
          id: comment_id,
          heart_type: "comment",
        });
        handleHeartCount(+1);
      }
    } catch (error) {
      console.log(error);
    }
  }, [comment_id, accessToken, handleHeartCount]);

  /* 댓글 좋아요 delete */
  const deleteLikeComment = useCallback(async () => {
    try {
      await api.delete("/hearts", {
        data: {
          id: comment_id,
          heart_type: "comment",
        },
      });
      handleHeartCount(-1);
    } catch (error) {
      console.log(error);
    }
  }, [comment_id, handleHeartCount]);

  /* 시간 표기 형식 변환 */
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);

    let formatted = date.toLocaleDateString("ko-KR", options);
    formatted = formatted.replace(/\. \(/g, " (");

    return formatted;
  };

  return (
    <div className="comments-comment" key={comment_id}>
      <div className="comment__top">
        <div className="comment__top__info">
          <span className="comment__top__author">{author}</span>
          <img src={verticalLine} alt="vertical-line" />
          <span className="comment__top__date">{formatDate(modified_at)}</span>
        </div>
        {isAuthor && (
          <img
            className="comment__top__menu"
            src={menu}
            alt="comment-menu"
            onClick={() => {
              setModal(!modal);
            }}
          />
        )}
      </div>
      {modal && (
        <div className="comment__modal">
          <div
            className="comment__modal__modify"
            onClick={() => {
              setModal(false);
              setModify(!modify);
            }}
          >
            수정
          </div>
          <div
            className="comment__modal__delete"
            onClick={(e) => handleDelete(e)}
          >
            삭제
          </div>
        </div>
      )}
      <div className="comment__body">
        {modify ? (
          <>
            <textarea
              className="comment__content--modify"
              value={newContent}
              onChange={(e) => {
                setNewContent(e.target.value);
              }}
            />
            <div className="comment__button">
              <button
                className="comment__button__cancel"
                onClick={() => {
                  setModify(!modify);
                  setModal(false);
                }}
              >
                취소
              </button>
              <button
                className="comment__button__complete"
                onClick={(e) => handleSubmit(e)}
              >
                완료
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="comment__content">{newContent}</div>
          </>
        )}
        <button
          className="comments__like"
          onClick={isLiked ? deleteLikeComment : likeComment}
        >
          <img
            className="comments__like__img"
            src={isLiked ? heartFill : heart}
            alt="like"
          />
          <span className="comments__like__count">{heartCount}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentItem;
