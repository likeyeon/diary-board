import "../styles/post-filter.scss";
import { useState } from "react";

const Filters = ({ onOrder, onDate }) => {
  const [orderOption, setOrderOption] = useState("id");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderOption(e.target.value);
    onOrder(e.target.value);
  };

  const handleStartDate = (e) => {
    e.preventDefault();
    setStartDate(e.target.value);
    if (endDate) {
      onDate(e.target.value, endDate);
    }
  };

  const handleEndDate = (e) => {
    e.preventDefault();
    setEndDate(e.target.value);
    if (startDate) {
      onDate(startDate, e.target.value);
    }
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
              onChange={(e) => handleStartDate(e)}
              value={startDate}
            />
          </label>
          <label htmlFor="fromDate" className="filter-date__label to">
            To
            <input
              type="date"
              name="toDate"
              className="filter-date__input to"
              onChange={(e) => handleEndDate(e)}
              value={endDate}
            />
          </label>
        </div>
      </div>
      <div className="filter-right">
        {/* <div className="filter-check">
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
        </div> */}
        <div className="filter-order">
          <select
            name="order"
            value={orderOption}
            onChange={(e) => handleOrderSubmit(e)}
            id="order"
            className="filter-order__select"
          >
            <option value="id">최신순</option>
            <option value="heart">공감순</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
