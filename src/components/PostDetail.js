import { useCallback, useEffect, useState } from "react";
import "../styles/detail.scss";
import { useNavigate, Link } from "react-router-dom";
import notFound from "../assets/not-found.jpg";
import api from "../utils/api";
import { useSelector } from "react-redux";
import chevronLeft from "../assets/chevron-left.svg";
import verticalLine from "../assets/verticalLine.svg";
import heart from "../assets/heart.svg";
import heartFill from "../assets/heart-fill.svg";
import { isAuth } from "../utils/AuthApi";
import { isLogin } from "../utils/jwtUtils";
import store from "../redux/store";
import { s3Bucket } from "../utils/s3Bucket";

const PostDetail = ({
  id,
  title,
  content,
  created_at,
  updated_at,
  author,
  heart_count,
  is_hearted,
  image,
}) => {
  const navigate = useNavigate();

  const accessToken = useSelector((state) => state.Auth.accessToken);

  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);
  const [heartCount, setHeartCount] = useState(heart_count);
  const [isLiked, setIsLiked] = useState(false);

  const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;
  const REGION = process.env.REACT_APP_AWS_REGION;

  /* 게시글 수정 함수 */
  const moveToUpdate = () => {
    navigate(`/board/update/${id}`);
  };

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

  /* 모달창 표시 여부 */
  const [show, isShow] = useState(false);
  const setShow = useCallback(() => {
    isShow(!show);
  }, [show]);

  /* 이미지 삭제 함수 */
  const deleteFile = async () => {
    const myBucket = s3Bucket();
    const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;

    const params = {
      Bucket: S3_BUCKET,
      Key: image,
    };

    try {
      await myBucket.deleteObject(params).promise();
      console.log("file deleted Successfully");
    } catch (err) {
      console.log("ERROR in file Deleting : " + JSON.stringify(err));
    }
  };

  /* 삭제 확인 버튼 클릭 시 */
  const deletePost = useCallback(async () => {
    setShow();
    try {
      await api.delete(`/posts/${id}`);
      alert("게시글이 삭제되었습니다");
      navigate("/board");
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      } else console.log(error);
    }
  }, [id, navigate, setShow]);

  /* 하트 수 함수 */
  const handleHeartCount = useCallback(
    (operation) => {
      setHeartCount(heartCount + operation);
      setIsLiked(!isLiked);
    },
    [heartCount, isLiked]
  );

  /* 이미지 삭제, 게시글 삭제 함수 */
  const handleDelete = () => {
    deleteFile();
    deletePost();
  };

  /* 좋아요 post */
  const likePost = useCallback(async () => {
    try {
      if (!isLogin(accessToken)) {
        alert("로그인이 필요한 기능입니다");
      } else {
        await api.post("/hearts", {
          id: id,
          heart_type: "post",
        });
        handleHeartCount(+1);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id, accessToken, handleHeartCount]);

  /* 좋아요 delete */
  const deleteLikePost = useCallback(async () => {
    try {
      await api.delete("/hearts", {
        data: {
          id: id,
          heart_type: "post",
        },
      });
      handleHeartCount(-1);
    } catch (error) {
      console.log(error);
    }
  }, [id, handleHeartCount]);

  useEffect(() => {
    // 사용자의 닉네임과 게시글 작성자의 닉네임이 같은지 비교
    // access tokn이 있으면 isAuth 함수를 호출하여 사용자의 닉네임을 변수에 저장한다.
    const fetchNickname = async () => {
      const myNickname = store.getState().Auth.accessToken
        ? await isAuth(accessToken)
        : "";
      if (myNickname === author) {
        setIsAuthor(true);
      }
      setLoading(false);
    };
    fetchNickname();
    setHeartCount(heart_count);
    setIsLiked(is_hearted);
  }, [accessToken, author, isAuthor, heart_count, is_hearted]);

  if (loading) return <div>loading...</div>;
  else
    return (
      <div className="postDetail">
        <div className="postDetail-link">
          <div className="postDetail-link__previous">
            <img
              className="postDetail-link__previous--icon"
              src={chevronLeft}
              alt="chevron-left"
            />
            <Link to={"/board"} className="postDetail-link__previous--text">
              홈으로
            </Link>
          </div>
          {isAuthor ? (
            <div className="postDetail-link__btn">
              <button
                className="postDetail-link__btn--update"
                onClick={moveToUpdate}
              >
                수정
              </button>
              <button
                className="postDetail-link__btn--delete"
                onClick={setShow}
              >
                삭제
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="postDetail-contents">
          <div className="postDetail-contents__top">
            <div className="postDetail-contents__top__left">
              <h1 className="postDetail-contents__title">{title}</h1>
              <div className="postDetail-contents__info">
                <span className="postDetail-contents__info--updated">
                  {formatDate(updated_at ? updated_at : created_at)}
                </span>
                <span>
                  <img src={verticalLine} alt="vertical-line" />
                </span>
                <span className="postDetail-contents__info--memeber">
                  {author}
                </span>
              </div>
            </div>
            {isLiked ? (
              <div
                className="postDetail-contents__top__like"
                onClick={deleteLikePost}
              >
                <img
                  className="postDetail-contents__like__img"
                  src={heartFill}
                  alt="like-fill"
                />
                <span className="postDetail-contents__like__count">
                  {heartCount}
                </span>
              </div>
            ) : (
              <div
                className="postDetail-contents__top__like"
                onClick={likePost}
              >
                <img
                  className="postDetail-contents__like__img"
                  src={heart}
                  alt="like"
                />
                <span className="postDetail-contents__like__count">
                  {heartCount}
                </span>
              </div>
            )}
          </div>
          <div className="postDetail-contents__bottom">
            {image ? (
              <img
                className="postDetail-contents__img"
                src={`https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${image}`} // 임의 url
                alt="contents-img"
              />
            ) : (
              <img
                className="postDetail-contents__img"
                src={notFound}
                alt="contents-img-notFound"
              />
            )}
            <p className="postDetail-contents__content">{content}</p>
          </div>
        </div>

        <div className={`modal-box${show ? "--show" : ""}`}>
          <div className="modal-wrapper">
            <div className="modal-content">
              <div className="modal__title">게시글 삭제</div>
              <div className="modal__subText">정말로 삭제하시겠습니까?</div>
              <div className="modal__button">
                <button onClick={setShow} className="modal__button--cancel">
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="modal__button--confirm"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default PostDetail;
