import "./Navigation.css";
import { Link, NavLink } from "react-router";
import { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { nanoid } from "nanoid";


function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { handleLogout } = useContext(AuthContext);

  const roomId = nanoid();

  const handleGuestUser = async () =>{
    roomId = nanoid();
  }

  return (
    <div className="NavigationContainer">
      <div className="navbar">
        <div>
          <Link className="app" to={"/"}>
            <i className="fa-solid fa-video"></i>
            <h1>&nbsp; LiveMeet </h1>
          </Link>
        </div>
        <div className="auth">
          {localStorage.token ? (
            <Link
              className="link"
              to={"/history"}
            >
              <RestoreIcon />
              History
            </Link>
          ) : (
            <Link className="link" type="button" to={`/${roomId}`} onClick={() => handleGuestUser()}>
              Join as Guest
            </Link>
          )}
          {localStorage.token ? (
            <Link
              className="link"
              type="button"
              onClick={async () => await handleLogout()}
            >
              Logout
            </Link>
          ) : (
            <Link className="link" to={"/auth"}>
              Login
            </Link>
          )}
          <Link className="link" to={"/support"}>
            Support
          </Link>
        </div>
        <div className="btn" onClick={toggleMenu}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>
      {isMenuOpen && (
        <div className="menu">
          {localStorage.token ? (
            <NavLink
              className="link"
              to={"/history"}
            >
              <RestoreIcon />
              History
            </NavLink>
          ) : (
            <NavLink
              className="link"
              type="button"
              to={`/${roomId}`}
              onClick={() => handleGuestUser()}
              style={({ isActive }) => ({
                color: isActive ? "greenyellow" : "white",
              })}
            >
              Join as Guest
            </NavLink>
          )}
          {localStorage.token ? (
            <NavLink
              type="button"
              className="navlink"
              onClick={async () => await handleLogout()}
              style={({ isActive }) => ({
                color: isActive ? "greenyellow" : "white",
              })}
            >
              Logout
            </NavLink>
          ) : (
            <NavLink
              className="navlink"
              to={"/auth"}
              style={({ isActive }) => ({
                color: isActive ? "greenyellow" : "white",
              })}
            >
              Login
            </NavLink>
          )}
          <NavLink
            className="navlink"
            to={"/support"}
            style={({ isActive }) => ({
              color: isActive ? "rgb(80, 220, 160)" : "white",
            })}
          >
            Support
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default Navigation;
