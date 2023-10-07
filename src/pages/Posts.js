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
  const [stateOrderOption, setOrderOption] = useState("asc");
  const size = 8; //페이지 당 게시글 개수

  /* 게시글 목록 받기 */
  // const getPostsList = useCallback(() => {
  //   filterPosts();
  // }, []);

  /* 모든 옵션을 쿼리 파라미터와 함께 api 호출 */
  const filterPosts = async (page, orderOption, searchOption, searchText) => {
    try {
      const response = await axios.get(
        `/posts?page=${page}&&size=${size}&&direction=${orderOption}&&searchBy=${searchOption}&&keyword=${searchText}`
      );
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
    console.log(searchOption, searchText);
    filterPosts(statePage, stateOrderOption, searchOption, searchText);
  };

  /* 게시글 정렬 */
  const handleOrder = async (orderOption) => {
    setOrderOption(orderOption);
    filterPosts(statePage, orderOption, stateSearchOption, stateSearchText);
  };

  /* 페이징 */
  const handlePaging = (page) => {
    setPage(page - 1);
    filterPosts(page - 1, stateOrderOption, stateSearchOption, stateSearchText);
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
      <Filters onOrder={handleOrder} />
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
