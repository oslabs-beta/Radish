import React from "react";
import ToggleColorMode from "../src/ToggleColorMode";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, resetUser } from "../Redux/slices/userSlice";
import RadishLogo from "../asset/RadishLogo2-3.png";

const Header = ({ mode, toggleColorMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);


  return (
    <header className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <img src={RadishLogo} alt="Radish Logo" className="h-8 w-auto" />
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              RADISH
            </Link>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="text-center m-2">
            <Link to="/register">Register</Link>
          </div>
          <div>
            {user ? (
              <button
                className="flex items-center justify-center m-2"
                onClick={async () => {
                  await fetch("/api/users/logout");
                  await dispatch(logoutUser());
                  dispatch(resetUser());
                  navigate("/");
                }}
              >
                <span className="flex items-center">
                  <FaSignOutAlt className="mr-1" style={{ lineHeight: 1 }} />
                  <span style={{ verticalAlign: "middle" }}>Logout</span>
                </span>
              </button>
            ) : (
              <Link
                className="flex items-center justify-center m-2"
                to="/login"
              >
                <span className="flex items-center">
                  <FaSignInAlt className="mr-1" style={{ lineHeight: 1 }} />
                  <span style={{ verticalAlign: "middle" }}>Login</span>
                </span>
              </Link>
            )}
          </div>
          <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
        </div>
      </div>
    </header>
  );
};

export default Header;
