import Navbar1 from "../components/Navbar1";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar1 />
      <Outlet />
    </>
  );
};

export default Layout;
