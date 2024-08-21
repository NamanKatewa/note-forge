import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth";
import { apiRoute, formatDeadline } from "../utils";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import SolutionCard from "../components/SolutionCard";

const Assignment = () => {
  const [detail, setDetail] = useState();
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [solutions, setSolutions] = useState([]);
  const { assignmentId } = useParams();
  const { authenticated, getSessionCookie } = useAuth();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const getDetail = async () => {
    const res = await axios.post(`${apiRoute}/assignments/detail`, {
      id: assignmentId,
    });
    setDetail(res.data);
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post(`${apiRoute}/solution/add`, {
        cookie: getSessionCookie(),
        content,
        link,
        assignmentId,
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

  const getSolutions = async () => {
    const res = await axios.post(`${apiRoute}/solution/assignment`, {
      assignmentId,
    });
    setSolutions(res.data);
  };

  useEffect(() => {
    getDetail();
    getSolutions();
  }, [refresh]);

  return (
    <div className="assignment">
      <h1>{detail && detail.subject.name}</h1>
      <h3>{detail && detail.title}</h3>
      <p>{detail && formatDeadline(detail.deadline)}</p>
      {authenticated ? (
        <>
          <button className="create-button" onClick={openModal}>
            Add Solution
          </button>
          <Modal show={showModal} onClose={closeModal}>
            <input
              type="text"
              onChange={(e) => setContent(e.target.value)}
              placeholder="Solution Description"
            />
            <input
              type="text"
              onChange={(e) => setLink(e.target.value)}
              placeholder="Catbox.moe link for the solution"
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
        </>
      ) : (
        "Login to add your own solutions"
      )}
      {solutions.length > 0 ? (
        <div className="list">
          {solutions.map((s) => (
            <SolutionCard
              key={s.id}
              data={s}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          ))}
        </div>
      ) : (
        <h4>No solutions yet</h4>
      )}
    </div>
  );
};

export default Assignment;
