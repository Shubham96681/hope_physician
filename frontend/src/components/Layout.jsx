import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />  {/* This renders the nested route content */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
