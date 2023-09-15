import { Outlet } from "react-router-dom";
import "../styles/layout.scss";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
