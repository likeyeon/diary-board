import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Posts from "./pages/Posts";
import DetailPost from "./pages/DetailPost";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import "./styles/reset.scss";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<DetailPost />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/update/:id" element={<UpdatePost />} />
      </Route>
    </Routes>
  );
};

export default App;
