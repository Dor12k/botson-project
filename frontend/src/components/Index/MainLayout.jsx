
import Header from "./Header";
import { Outlet } from "react-router-dom";




const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;