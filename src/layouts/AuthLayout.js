import React, { useCallback, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { isLogin } from "../utils/jwtUtils";
import { useSelector } from "react-redux";
import "../styles/layout.scss";
import Header from "./Header";
import axios from "axios";
import { getCookie } from "../utils/cookies";
import { setToken } from "../redux/AuthReducer";
import store from "../redux/store";
import jwtDecode from "jwt-decode";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const accessToken = useSelector((state) => state.Auth.accessToken);
  const refreshToken = getCookie("refreshToken");

  const onSilentRefresh = useCallback(async () => {
    await axios
      .get(process.env.REACT_APP_DB_HOST + "/members/reissue", {
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
    // 로그인이 되어 있지 않으면 로그인 페이지로 이동
    if (!isLogin(accessToken)) {
      alert("로그인이 필요한 페이지입니다");
      navigate("/login", { state: pathname });
    }
    //새로 고침하면 바로 로그인 연장(토큰 갱신)
    else if (performance.getEntriesByType("navigation")[0].type === "reload") {
      onSilentRefresh();
    }
  }, [onSilentRefresh, accessToken, navigate, pathname]);

  useEffect(() => {}, [accessToken, navigate, pathname]);

  return (
    <>
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
