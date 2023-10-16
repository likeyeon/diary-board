import React, { useState } from "react";
import "../styles/paging.scss";
import Pagination from "react-js-pagination";

const Paging = ({ onPaging, totalPostCount, size }) => {
  const [page, setPage] = useState(1); //페이지 번호 (1부터 시작)

  const handlePageChange = (page) => {
    setPage(page);
    onPaging(page);
  };

  return (
    <Pagination
      activePage={page}
      itemsCountPerPage={size}
      totalItemsCount={totalPostCount}
      pageRangeDisplayed={5}
      prevPageText={"‹"}
      nextPageText={"›"}
      onChange={handlePageChange}
    />
  );
};

export default Paging;
