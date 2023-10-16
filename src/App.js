import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Posts from "./pages/Posts";
import DetailPost from "./pages/DetailPost";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import Profile from "./pages/Profile";
import Main from "./pages/Main";
import "./styles/reset.scss";
import AuthLayout from "./layouts/AuthLayout";
import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { getCookie } from "./utils/cookies";
import { setToken } from "./redux/AuthReducer";
import store from "./redux/store";

import jwtDecode from "jwt-decode";

const App = () => {
  const refreshToken = getCookie("refreshToken");

  const onSilentRefresh = useCallback(() => {
    axios
      .get("/members/reissue", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .then((response) => {
        store.dispatch(setToken(response.data.access_token));

        //access token 만료 1분 전, 액세스 토큰 재발급
        const decodedToken = jwtDecode(response.data.access_token);

        const delay = decodedToken.exp * 1000 - Date.now() - 120 * 1000;
        setTimeout(onSilentRefresh, delay);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshToken]);

  useEffect(() => {
    //새로고침하면 바로 로그인 연장(토큰 갱신)
    if (performance.getEntriesByType("navigation")[0].type === "reload") {
      onSilentRefresh();
    }
  }, [onSilentRefresh]);

  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/board" element={<Posts />} />
        <Route path="/board/:id" element={<DetailPost />} />
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/board/create" element={<CreatePost />} />
        <Route path="/board/update/:id" element={<UpdatePost />} />
      </Route>
    </Routes>
  );
};

export default App;
