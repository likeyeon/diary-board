import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { isLogin } from "../utils/jwtUtils";
import { useSelector } from "react-redux";
import "../styles/layout.scss";
import Header from "./Header";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const accessToken = useSelector((state) => state.Auth.accessToken);

  useEffect(() => {
    if (!isLogin(accessToken)) {
      alert("로그인이 필요한 페이지입니다");
      navigate("/login", { state: pathname });
    }
  }, []);

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
