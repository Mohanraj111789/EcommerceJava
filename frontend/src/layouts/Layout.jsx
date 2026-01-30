import Navbar1 from "../components/Navbar1";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
    <div className="layout">
      <Navbar1 />
    </div>
      <Outlet />
    </>
  );
};

export default Layout;
