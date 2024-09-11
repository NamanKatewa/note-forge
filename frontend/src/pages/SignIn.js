import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiRoute } from "../utils";
import { useAuth } from "../auth";
import Loader from "../components/Loader";
import { Mail, Lock, ArrowRight } from "lucide-react";
import "./SignIn.scss";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiRoute}/auth/login`, {
        email,
        password,
      });

      if (res.status === 200) {
        login(res.data.cookie, res.data.role, res.data.userId);
        navigate("/");
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
    <div className="login-container">
      {loading && <Loader />}
      <div className="login-box">
        <div className="login-header">
          <h1>Login</h1>
        </div>
        <form>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
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
              onClick={handleSubmit}
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
  );
};

export default SignIn;
