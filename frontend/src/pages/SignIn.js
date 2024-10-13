import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiRoute } from "../utils";
import Loader from "../components/Loader";
import { Mail, Lock, ArrowRight } from "lucide-react";
import "./SignIn.scss";
import authStore from "../authStore";
import { useMutation } from "@tanstack/react-query";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = authStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/auth/login`, {
        email,
        password,
      });
    },
    onSuccess: (data) => {
      login(data.data.cookie, data.data.role, data.data.userId);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <>
      {loginMutation.isPending && <Loader />}
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>Login</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoFocus={true}
                  required
                />
                <Mail className="icon" size={18} />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <Lock className="icon" size={18} />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="submit-button"
                disabled={loginMutation.isPending}
              >
                Login
                <ArrowRight className="arrow-icon" size={18} />
              </button>
            </div>
          </form>
          <div className="forgot-password">
            <button
              onClick={() => {
                navigate("/forgotpassword");
              }}
            >
              Forgot password?
            </button>
          </div>
          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
