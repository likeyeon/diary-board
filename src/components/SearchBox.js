import "../styles/searchBox.scss";
import { useState } from "react";

const SearchBox = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [searchOption, setSearchOption] = useState("all");

  const onChangeSearch = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSearch(searchOption, searchText);
  };

  return (
    <div className="searchBox">
      <form
        className="searchBox-form"
        method="get"
        onSubmit={(e) => handleSubmit(e)}
      >
        <select
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          name="order"
          id="order"
          className="searchBox__select"
        >
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="author">작성자</option>
          <option value="content">내용</option>
        </select>
        <input
          className="searchBox__input"
          type="text"
          value={searchText}
          placeholder="검색어를 입력해주세요"
          onChange={onChangeSearch}
        />
        <button type="submit" className="searchBox__btn">
          검색
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
