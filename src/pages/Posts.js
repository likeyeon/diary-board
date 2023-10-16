import PostsList from "../components/PostsList";
import Paging from "../components/Paging";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/post-list.scss";
import SearchBox from "../components/SearchBox";
import Filters from "../components/Filters";

const Posts = () => {
  const [postsList, setPostsList] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [statePage, setPage] = useState(0);
  const [stateSearchText, setSearchText] = useState("");
  const [stateSearchOption, setSearchOption] = useState("all");
  const [stateOrderOption, setOrderOption] = useState("id");
  const [stateDateOption, setDateOption] = useState(["", ""]);
  const size = 8; //페이지 당 게시글 개수

  /* 모든 옵션을 쿼리 파라미터와 함께 api 호출 */
  const filterPosts = async (
    page,
    orderOption,
    searchOption,
    searchText,
    startDate,
    endDate
  ) => {
    try {
      let url = `/posts?page=${page}&&size=${size}&&sortBy=${orderOption}&&searchBy=${searchOption}&&keyword=${searchText}`;
      if (startDate && endDate) {
        url += `&&startDate=${startDate}&&endDate=${endDate}`;
      }
      const response = await axios.get(url);
      setTotalPostCount(response.data.totalElements);
      setPostsList(response.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  /* 게시글 검색 */
  const handleSearch = async (searchOption, searchText) => {
    setSearchOption(searchOption);
    setSearchText(searchText);
    filterPosts(
      statePage,
      stateOrderOption,
      searchOption,
      searchText,
      stateDateOption[0],
      stateDateOption[1]
    );
  };

  /* 게시글 정렬 */
  const handleOrder = async (orderOption) => {
    setOrderOption(orderOption);
    filterPosts(
      statePage,
      orderOption,
      stateSearchOption,
      stateSearchText,
      stateDateOption[0],
      stateDateOption[1]
    );
  };

  /* 날짜 선택 */
  const handleDate = async (startDate, endDate) => {
    setDateOption([startDate, endDate]);
    filterPosts(
      statePage,
      stateOrderOption,
      stateSearchOption,
      stateSearchText,
      startDate,
      endDate
    );
  };

  /* 페이징 */
  const handlePaging = (page) => {
    setPage(page - 1);
    filterPosts(
      page - 1,
      stateOrderOption,
      stateSearchOption,
      stateSearchText,
      stateDateOption[0],
      stateDateOption[1]
    );
  };

  useEffect(() => {
    filterPosts(
      statePage,
      stateOrderOption,
      stateSearchOption,
      stateSearchText
    );
  }, []);

  return (
    <>
      <Filters onOrder={handleOrder} onDate={handleDate} />
      <PostsList postsList={postsList} />
      <Paging
        onPaging={handlePaging}
        totalPostCount={totalPostCount}
        size={size}
      />
      <SearchBox onSearch={handleSearch} />
    </>
  );
};

export default Posts;
