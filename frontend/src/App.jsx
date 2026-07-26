
import { Outlet } from "react-router";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./utils/Navigation";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <>
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        style={{ zIndex: 99999 }}
      />
      <Navigation className="navbar"></Navigation>
      <div className="main">
        <Outlet />
      </div>
    </AuthProvider>
    </>
  );
}

export default App;
