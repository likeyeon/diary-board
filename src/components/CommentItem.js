import { useEffect, useCallback, useState } from "react";
import menu from "../assets/menu-kebab.svg";
import api from "../utils/api";

const CommentItem = ({
  comment_id,
  author,
  content,
  modified_at,
  userNickname,
  updateComment,
  deleteComment,
}) => {
  const [modal, setModal] = useState(false);
  const [modify, setModify] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [newContent, setNewContent] = useState(content);

  useEffect(() => {
    // 댓글 작성자와 로그인한 사용자의 닉네임이 같은지 비교
    if (userNickname === author) setIsAuthor(true);
  }, [userNickname, author]);

  const handleSubmit = (e) => {
    updateComment(comment_id, newContent);
    setModify(false);
  };

  const handleDelete = (e) => {
    deleteComment(comment_id);
    setModal(false);
  };

  return (
    <div className="comments-comment" key={comment_id}>
      <div className="comment__top">
        <div className="comment__author">{author}</div>
        {isAuthor && (
          <img
            className="comment__menu"
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
            <div className="comment__date">{modified_at}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
