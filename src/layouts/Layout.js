import { Outlet } from "react-router-dom";
import "../styles/layout.scss";

const Layout = () => {
  return (
    <div className="content">
      <Outlet />
    </div>
  );
};

export default Layout;
