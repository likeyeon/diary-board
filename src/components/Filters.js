import "../styles/post-filter.scss";
import { useState } from "react";

const Filters = ({ onOrder }) => {
  const [orderOption, setOrderOption] = useState("asc");

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderOption(e.target.value);
    onOrder(orderOption);
  };

  return (
    <div className="posts-filter">
      <div className="filter-left">
        <div className="filter-date">
          <label htmlFor="fromDate" className="filter-date__label from">
            From
            <input
              type="date"
              name="fromDate"
              className="filter-date__input from"
            />
          </label>
          <label htmlFor="fromDate" className="filter-date__label to">
            To
            <input
              type="date"
              name="toDate"
              className="filter-date__input to"
            />
          </label>
        </div>
      </div>
      <div className="filter-right">
        <div className="filter-check">
          <input
            type="checkbox"
            id="myPost"
            name="myPost"
            value="myPost"
            className="filter-check__checkbox"
          />
          <label htmlFor="myPost" className="filter-check__label">
            내가 쓴 게시물 보기
          </label>
        </div>
        <div className="filter-order">
          <select
            name="order"
            value={orderOption}
            onChange={(e) => handleSubmit(e)}
            id="order"
            className="filter-order__select"
          >
            <option value="asc">최신순</option>
            <option value="desc">공감순</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
