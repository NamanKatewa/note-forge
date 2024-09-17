import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRoute, formatDeadline } from "../utils";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import PaperCard from "../components/PaperCard";
import "./Exam.scss";
import authStore from "../authStore";

const Exam = () => {
  const [detail, setDetail] = useState();
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [papers, setPapers] = useState([]);
  const { examId } = useParams();
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAdd = async () => {
    try {
      const res = await axios.post(`${apiRoute}/papers/add`, {
        cookie: sessionCookie,
        title,
        link,
        examId,
      });

      if (res.status === 200) {
        toast.success(res.data);
        setRefresh(!refresh);
        closeModal();
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("Something went wrong. Try Again");
      }
    }
  };

  useEffect(() => {
    const getDetail = async () => {
      const res = await axios.post(`${apiRoute}/exams/detail`, {
        id: examId,
      });
      setDetail(res.data);
    };

    const getPapers = async () => {
      const res = await axios.post(`${apiRoute}/papers/exam`, {
        examId,
      });
      setPapers(res.data);
    };
    getDetail();
    getPapers();
  }, [refresh, examId]);

  return (
    <div className="exam">
      <h1>{detail && detail.subject.name}</h1>
      <h3>{detail && detail.title}</h3>
      <p>{detail && formatDeadline(detail.deadline)}</p>
      {authenticated ? (
        <div className="create-buttons">
          <button className="create-button" onClick={openModal}>
            Add Paper
          </button>
          <Modal show={showModal} onClose={closeModal}>
            <label>Title</label>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paper Title"
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdd();
                }
              }}
            />
            <label>Link</label>
            <input
              type="text"
              onChange={(e) => setLink(e.target.value)}
              placeholder="Catbox.moe link for the solution"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdd();
                }
              }}
            />
            <button className="primary-action-button" onClick={handleAdd}>
              Add
            </button>
            <button
              className="secondary-action-button"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </button>
          </Modal>
        </div>
      ) : (
        "Login to add your own solutions"
      )}
      {papers.length > 0 ? (
        <div className="list">
          {papers.map((s) => (
            <PaperCard
              key={s.id}
              data={s}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          ))}
        </div>
      ) : (
        <h4>No papers yet</h4>
      )}
    </div>
  );
};

export default Exam;
