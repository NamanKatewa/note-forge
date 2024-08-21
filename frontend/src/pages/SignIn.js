import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiRoute } from "../utils";
import { useAuth } from "../auth";
import Loader from "../components/Loader";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiRoute}/auth/login`, {
        email,
        password,
      });

      if (res.status === 200) {
        login(res.data.cookie, res.data.role, res.data.userId);
        navigate("/subjects");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("Something went wrong. Try Again");
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth">
      {loading && <Loader />}
      <input
        type="text"
        placeholder="Enter your email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        autoFocus={true}
      />
      <input
        type="password"
        placeholder="Enter your password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <button onClick={handleSubmit}>Sign In</button>
      <button
        onClick={() => {
          navigate("/forgotpassword");
        }}
      >
        Forgot Password?
      </button>
    </div>
  );
};

export default SignIn;
