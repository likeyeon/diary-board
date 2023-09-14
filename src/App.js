import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Posts from "./pages/Posts";
import Detail from "./pages/Detail";
import "./styles/reset.scss";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<Detail />} />
      </Route>
    </Routes>
  );
};

export default App;
