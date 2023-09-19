import "../styles/searchBox.scss";

const SearchBox = () => {
  return (
    <div className="searchBox">
      <form className="searchBox-form">
        <select name="order" id="order" className="searchBox__select">
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="author">작성자</option>
          <option value="content">내용</option>
        </select>
        <input
          type="search"
          id="postSearch"
          name="postSearch"
          className="searchBox__input"
        />
        <button type="submit" className="searchBox__btn">
          검색
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
