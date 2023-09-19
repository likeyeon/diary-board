import PostsList from "../components/PostsList";
import Filters from "../components/Filters";
import Paging from "../components/Paging";
import SearchBox from "../components/SearchBox";

const Posts = () => {
  return (
    <>
      <Filters />
      <PostsList />
      <Paging />
      <SearchBox />
    </>
  );
};

export default Posts;
