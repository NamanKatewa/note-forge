import React, { useState } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiRoute } from "../utils";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const { authenticated, getSessionCookie, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="top">
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
      </div>
      <div className="search">
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
      </div>
    </div>
  );
};

export default Navbar;
