import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Posts from "./pages/Posts";
import DetailPost from "./pages/DetailPost";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import Profile from "./pages/Profile";
import "./styles/reset.scss";
import AuthLayout from "./layouts/AuthLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/posts" element={<Posts />} />
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="/posts/:id" element={<DetailPost />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/update/:id" element={<UpdatePost />} />
      </Route>
    </Routes>
  );
};

export default App;
