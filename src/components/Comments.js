import api from "../utils/api";
import { useEffect, useCallback, useState } from "react";
import CommentItem from "./CommentItem";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { isAuth } from "../utils/AuthApi";

const Comment = ({ id, commentList }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const accessToken = useSelector((state) => state.Auth.accessToken);

  useEffect(() => {
    // 사용자의 닉네임과 게시글 작성자의 닉네임이 같은지 비교
    // access tokn이 있으면 isAuth 함수를 호출하여 사용자의 닉네임을 변수에 저장한다.
    const fetchNickname = async () => {
      setUserNickname(accessToken ? await isAuth(accessToken) : "");
      setComments(commentList);
    };
    fetchNickname();
  }, [accessToken, commentList]);

  /* 댓글 작성 */
  // 로그인한 사용자만 댓글을 작성할 수 있으므로 interceptor 사용하여 token 인증
  const submit = useCallback(async () => {
    try {
      const comment = {
        post_id: id,
        content: content,
      };
      const response = await api.post("/comments", comment);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      if (error.response.status === 400) {
        if (error.response.data.code === "JSON_001") {
          alert("내용을 작성해주세요");
        } else if (error.response.data.code === "TOKEN_001") {
          alert(error.response.data.message);
        }
      } else {
        alert("알 수 없는 에러");
        console.log(error);
      }
    }
  }, [content]);

  /* 댓글 수정 함수 */
  const updateComment = useCallback(
    async (id, newContent) => {
      try {
        await api.patch(`comments/${id}`, {
          content: newContent,
        });
        setComments(
          comments.map((comment) =>
            comment.comment_id === id
              ? { ...comment, content: newContent }
              : comment
          )
        );
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    [comments]
  );

  /* 댓글 삭제 함수 */
  const deleteComment = useCallback(
    async (id) => {
      try {
        await api.delete(`comments/${id}`);
        setComments(comments.filter((comment) => comment.comment_id !== id));
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    [comments]
  );

  return (
    <div className="comments-wrapper">
      <div className="comments-header">
        {accessToken ? (
          <>
            <textarea
              className="comments-header-textarea"
              placeholder="댓글을 입력해주세요"
              onChange={(e) => {
                setContent(e.target.value);
              }}
              value={content}
            ></textarea>
            <button className="comments-header-button" onClick={submit}>
              등록하기
            </button>
          </>
        ) : (
          <>
            <textarea className="comments-header-textarea" readOnly />
            <p>
              작성하려면 <Link to={"/login"}>로그인</Link>이 필요합니다
            </p>
            <button className="comments-header-button" disabled>
              등록하기
            </button>
          </>
        )}
      </div>
      <div className="comments-body">
        {comments &&
          comments.map((comment) => (
            <CommentItem
              key={comment.comment_id}
              comment_id={comment.comment_id}
              author={comment.author}
              content={comment.content}
              modified_at={comment.modified_at}
              userNickname={userNickname}
              updateComment={updateComment}
              deleteComment={deleteComment}
            />
          ))}
      </div>
    </div>
  );
};

export default Comment;
