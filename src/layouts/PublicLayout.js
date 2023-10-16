import { Outlet } from "react-router-dom";
import "../styles/layout.scss";
import Header from "./Header";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default PublicLayout;
