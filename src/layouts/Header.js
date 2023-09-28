import logo from "../assets/logo.svg";
import menu from "../assets/menu.svg";
import profile from "../assets/profile.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/header.scss";

const Header = () => {
  const [menuClicked, setMenuClicked] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);

  const handleMenuClick = () => {
    setMenuClicked(!menuClicked);
  };

  const handleProfileClick = () => {
    setProfileClicked(!profileClicked);
  };

  return (
    <div className="header-wrapper">
      <div className="header">
        <div className="header-toggleBtn" onClick={handleMenuClick}>
          <img src={menu} alt="menu" />
        </div>
        <div className="header-link">
          <div className="header-link-logo">
            <Link to="/posts">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          <div className="header-link-menu">
            <Link to="/posts">게시판</Link>
            <Link to="/create">글쓰기</Link>
          </div>
        </div>
        <div
          className={
            "header-link-menu--mobile" + (menuClicked ? "--active" : "")
          }
        >
          <Link to="/posts">게시판</Link>
          <Link to="/create">글쓰기</Link>
        </div>
        <div className="header-profile">
          {/* <Link to="/members/login">로그인</Link> */}
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
            <Link to="/">로그아웃</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
