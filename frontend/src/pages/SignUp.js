import React, { useState } from "react";
import { apiRoute } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [codeStat, setCodeStat] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerification = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiRoute}/auth/sendverify`, {
        email,
      });

      if (res.status === 200) {
        setCodeStat(true);
        toast.success(res.data);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("Something went wrong. Try again");
      }
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiRoute}/auth/register`, {
        email,
        code,
        name,
        password,
      });

      if (res.status === 200) {
        toast.success(res.data);
        navigate("/signin");
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
        type="email"
        placeholder="Email Address"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleVerification();
          }
        }}
        autoFocus={true}
      />
      {!codeStat && (
        <button onClick={handleVerification}>Get Verification Code</button>
      )}
      {codeStat && (
        <>
          <input
            type="text"
            placeholder="Verification Code"
            onChange={(e) => {
              setCode(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            autoFocus={true}
          />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <button onClick={handleSubmit}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default SignUp;
