import axios from "axios";
import React, { useState } from "react";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [tokenStat, setTokenStat] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const handleForgot = async () => {
    try {
      const res = await axios.post(`${apiRoute}/auth/forgotpassword`, {
        email,
      });

      if (res.status === 200) {
        setTokenStat(true);
        toast.success(res.data);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("Something went wrong. Try again");
      }
    }
  };

  const handleReset = async () => {
    try {
      const res = await axios.post(`${apiRoute}/auth/resetpassword`, {
        token,
        password,
      });

      if (res.status === 200) {
        toast.success(res.data);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("Something went wrong. Try Again");
      }
    }
  };
  return (
    <div className="auth">
      {!tokenStat && (
        <>
          <input
            type="email"
            placeholder="Enter your email address"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button onClick={handleForgot}>Get Token</button>
        </>
      )}
      {tokenStat && (
        <>
          <input
            type="text"
            placeholder="Enter token"
            onChange={(e) => {
              setToken(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button onClick={handleReset}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
