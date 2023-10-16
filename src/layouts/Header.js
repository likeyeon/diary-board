import logo from "../assets/logo.svg";
import menu from "../assets/menu.svg";
import profile from "../assets/profile.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isLogin } from "../utils/jwtUtils";
import "../styles/header.scss";
import { logoutAuth } from "../utils/AuthApi";
import { removeCookie } from "../utils/cookies";

const Header = () => {
  const accessToken = useSelector((state) => state.Auth.accessToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuClicked, setMenuClicked] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  useEffect(() => {
    isLogin(accessToken) ? setisLoggedIn(true) : setisLoggedIn(false);
  }, [accessToken]);

  const handleMenuClick = () => {
    setMenuClicked(!menuClicked);
  };

  const handleProfileClick = () => {
    setProfileClicked(!profileClicked);
  };

  const logoutMember = () => {
    logoutAuth(dispatch, removeCookie, navigate);
  };

  return (
    <div className="header-wrapper">
      <div className="header">
        <div className="header-toggleBtn" onClick={handleMenuClick}>
          <img src={menu} alt="menu" />
        </div>
        <div className="header-link">
          <div className="header-link-logo">
            <Link to="/board">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          <div className="header-link-menu">
            <Link to="/board">게시판</Link>
            <Link to="/board/create">글쓰기</Link>
          </div>
        </div>
        <div
          className={
            "header-link-menu--mobile" + (menuClicked ? "--active" : "")
          }
        >
          <Link to="/board">게시판</Link>
          <Link to="/board/create">글쓰기</Link>
        </div>
        <div className="header-profile">
          {isLoggedIn ? (
            <>
              <img
                src={profile}
                className="header-profile__img"
                alt="profile"
                onClick={handleProfileClick}
              />
              <div
                className={
                  "header-profile--modal" + (profileClicked ? "--active" : "")
                }
              >
                <Link to="/profile">프로필 설정</Link>
                <Link to="/">쪽지함</Link>
                <Link onClick={logoutMember}>로그아웃</Link>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
