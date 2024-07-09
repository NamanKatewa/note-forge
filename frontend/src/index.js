import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import AuthProvider from "./auth";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import Subjects from "./pages/Subjects";
import Subject from "./pages/Subject";
import Assignment from "./pages/Assignment";
import Search from "./pages/Search";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Toaster />
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/:subjectId/:name" element={<Subject />} />
        <Route path="/assignments/:assignmentId" element={<Assignment />} />
        <Route path="/search/:query" element={<Search />} />
      </Routes>
    </AuthProvider>
  </Router>
);
