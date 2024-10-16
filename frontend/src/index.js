import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
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
import Resources from "./pages/Resources";
import Books from "./pages/Books";
import Exam from "./pages/Exam";
import Announcements from "./pages/Announcements";
import Footer from "./components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import authStore from "./authStore";

const queryClient = new QueryClient();

function App() {
  const authenticated = authStore((state) => state.authenticated);

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="/" element={authenticated ? <Home /> : <Subjects />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/subjects/:subjectId/:name" element={<Subject />} />
          <Route path="/assignments/:assignmentId" element={<Assignment />} />
          <Route path="/exams/:examId" element={<Exam />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/books" element={<Books />} />
          <Route path="/announcements" element={<Announcements />} />
        </Routes>
        <Footer />
      </QueryClientProvider>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
