import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiRoute } from "../utils";
import { useMediaQuery } from "react-responsive";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const { authenticated, getSessionCookie, logout } = useAuth();
  const mobile = useMediaQuery({ maxWidth: "50px" });
  const { showMenu, setShowMenu } = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="navbar">
      <div
        className="logo"
        onClick={() => {
          navigate("/subjects");
        }}
      >
        Note Forge
      </div>
      <div className="links">
        <button
          onClick={() => {
            navigate("/subjects");
          }}
        >
          Subjects
        </button>
        <button
          onClick={() => {
            navigate("/resources");
          }}
        >
          Resources
        </button>
        <button
          onClick={() => {
            navigate("/books");
          }}
        >
          Books
        </button>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Saved
        </button>
      </div>
      <input
        type="text"
        placeholder="Search for something"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`search/${query}`);
          }
        }}
      />
      <button onClick={(e) => navigate(`search/${query}`)}>Search</button>
      {authenticated ? (
        <button
          onClick={() => {
            axios.post(`${apiRoute}/auth/logout`, {
              cookie: getSessionCookie(),
            });
            logout();
          }}
        >
          Sign Out
        </button>
      ) : (
        <>
          <button
            onClick={() => {
              navigate("/signin");
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </button>
        </>
      )}
      {mobile && <button onClick={() => toggleMenu}>Menu</button>}
    </div>
  );
};

export default Navbar;
