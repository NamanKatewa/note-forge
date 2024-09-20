import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRoute } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Mail, Lock, Check, ArrowRight, User } from "lucide-react";
import "./SignUp.scss";
import { useMutation } from "@tanstack/react-query";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 2) {
      verificationMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  const registerMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/auth/register`, {
        email,
        code,
        name,
        password,
      });
    },
    onSuccess: (data) => {
      toast.success(data.data);
      navigate("/signin");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const verificationMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/auth/sendverify`, {
        email,
      });
    },
    onSuccess: () => {
      setStep(step + 1);
      toast.success("Email Sent");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <>
      {(registerMutation.isPending || verificationMutation.isPending) && (
        <Loader />
      )}
      <div className="register-container">
        <div className="register-box">
          <div className="register-header">
            <h1>Create Your Account</h1>
            <p>Step {step} of 2</p>
          </div>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    autoFocus={true}
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="icon" size={18} />
                </div>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="input-group">
                  <label htmlFor="verificationCode">Verification Code</label>
                  <div className="input-wrapper">
                    <input
                      id="verificationCode"
                      type="text"
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                      autoFocus={true}
                      placeholder="Enter verification code"
                      required
                    />
                    <Check className="icon" size={18} />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-wrapper">
                    <input
                      id="username"
                      type="username"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      required
                    />
                    <User className="icon" size={18} />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      type="password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      placeholder="Create a password"
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
              disabled={
                verificationMutation.isPending || registerMutation.isPending
              }
            >
              {step < 2 ? "Next" : "Register"}
              <ArrowRight className="arrow-icon" size={18} />
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link to="/signin">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
