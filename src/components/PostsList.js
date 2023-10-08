import { Link } from "react-router-dom";
import "../styles/post-list.scss";
import notFound from "../assets/not-found.jpg";

const PostsList = ({ postsList }) => {
  /* 시간 형식 변환 */
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    };
    const date = new Date(dateString);

    let formatted = date.toLocaleDateString("ko-KR", options);
    formatted = formatted.replace(/\. \(/g, " (");

    return formatted;
  };

  return (
    <>
      <div className="post-list-wrapper">
        {postsList.length ? (
          <>
            <ul className="post-list">
              {postsList.map((post) => (
                <div className="post-list-item-wrapper" key={post.id}>
                  <Link to={`/posts/${post.id}`}>
                    <li
                      className="post-list-item"
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        className="post-list-item__img"
                        src={notFound}
                        alt="notFound"
                      />

                      <div className="post-list-item__top">
                        <div className="post-list-item__updated">
                          {formatDate(
                            post.modifed_at ? post.modified_at : post.created_at
                          )}
                        </div>
                        <div className="post-list-item__text">
                          <div className="post-list-item__title">
                            {post.title}
                          </div>
                          <p className="post-list-item__content">
                            {post.content}
                          </p>
                        </div>
                      </div>
                      <div className="post-list-item__bottom">
                        <span className="post-list-item__member">
                          {post.author}
                        </span>
                        <span className="post-list-item__likes">🖤 2</span>
                      </div>
                    </li>
                  </Link>
                </div>
              ))}
            </ul>
          </>
        ) : (
          <> 게시글이 비어있습니다.</>
        )}
      </div>
    </>
  );
};

export default PostsList;
