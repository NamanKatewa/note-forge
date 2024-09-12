import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import axios from "axios";
import { apiRoute } from "../utils";
import { Menu, X, Search, User, LogIn, LogOut } from "lucide-react";
import "./Navbar.scss";

const NavbarNew = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { authenticated, getSessionCookie, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="wrapper">
          <div className="left">
            <Link to="/" className="logo">
              Note Forge
            </Link>
            <div className="links">
              <Link to="/" className="link">
                Subjects
              </Link>
              <Link to="/resources" className="link">
                Resources
              </Link>
              <Link to="/books" className="link">
                Books
              </Link>
              <Link to="/saved" className="link">
                Saved
              </Link>
            </div>
          </div>
          <div className="right">
            <div className="searchContainer">
              <Search className="searchIcon" />
              <input
                type="text"
                placeholder="Search"
                className="searchInput"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`search/${query}`);
                  }
                }}
              />
            </div>
            <div className="authButtons">
              {authenticated ? (
                <button
                  onClick={() => {
                    axios.post(`${apiRoute}/auth/logout`, {
                      cookie: getSessionCookie(),
                    });
                    logout();
                  }}
                  className="authButton"
                >
                  <LogOut className="icon" />
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/signin");
                    }}
                    className="authButton"
                  >
                    <User className="icon" />
                    Sign In
                  </button>
                  <button
                    className="signUpButton"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    <LogIn className="icon" />
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="mobileMenuButton">
            <button onClick={() => setIsOpen(!isOpen)} className="menuToggle">
              {isOpen ? <X className="icon" /> : <Menu className="icon" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mobileMenu">
          <div className="searchContainer">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="Search"
              className="searchInput"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`search/${query}`);
                }
              }}
            />
          </div>
          <Link to="/" className="mobileLink">
            Home
          </Link>
          <Link to="/resources" className="mobileLink">
            Resources
          </Link>
          <Link to="/books" className="mobileLink">
            Books
          </Link>
          <Link to="/saved" className="mobileLink">
            Saved
          </Link>
          <div className="mobileAuthButtons">
            {authenticated ? (
              <button
                onClick={() => {
                  axios.post(`${apiRoute}/auth/logout`, {
                    cookie: getSessionCookie(),
                  });
                  logout();
                }}
                className="authButton"
              >
                <LogOut className="icon" />
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/signin");
                  }}
                  className="authButton"
                >
                  <User className="icon" />
                  Sign In
                </button>
                <button
                  className="signUpButton"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  <LogIn className="icon" />
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarNew;
