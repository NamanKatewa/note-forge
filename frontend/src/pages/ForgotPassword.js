import axios from "axios";
import React, { useState } from "react";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Check } from "lucide-react";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 2) {
      handleForgot();
    } else {
      handleReset();
    }
  };

  const handleForgot = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiRoute}/auth/forgotpassword`, {
        email,
      });

      if (res.status === 200) {
        setStep(step + 1);
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

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiRoute}/auth/resetpassword`, {
        token,
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
    <div className="forgot-container">
      {loading && <Loader />}
      <div className="forgot-box">
        <div className="forgot-header">
          <h1>Reset Your Password</h1>
          <p>Step {step} of 2</p>
        </div>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (step === 1) {
                        handleForgot();
                      }
                    }
                  }}
                  autoFocus={true}
                  required
                />
                <Mail className="icon" size={18} />
              </div>
            </div>
          )}
          {step === 2 && (
            <>
              <div className="input-group">
                <label htmlFor="token">Token</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter token"
                    onChange={(e) => {
                      setToken(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (step === 2) {
                          handleReset();
                        }
                      }
                    }}
                    autoFocus={true}
                    required
                  />
                  <Check className="icon" size={18} />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (step === 2) {
                          handleReset();
                        }
                      }
                    }}
                    required
                  />
                  <Lock className="icon" size={18} />
                </div>
              </div>
            </>
          )}
          <button
            type="submit"
            className="submit-button"
            onClick={handleSubmit}
          >
            {step < 2 ? "Next" : "Reset"}
            <ArrowRight className="arrow-icon" size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
