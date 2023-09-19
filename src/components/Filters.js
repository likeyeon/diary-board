import "../styles/post-filter.scss";

const Filters = () => {
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
          <form action="#" className="filter-order__form">
            <select name="order" id="order" className="filter-order__select">
              <option value="latest">최신순</option>
              <option value="popular">공감순</option>
            </select>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Filters;
