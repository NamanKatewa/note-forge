import React, { useState } from "react";
import { useAuth } from "../auth";
import toast from "react-hot-toast";
import axios from "axios";
import { apiRoute } from "../utils";
import Modal from "./Modal";

const PaperCard = ({ data, refresh, setRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [link, setLink] = useState(data.link);
  const { authenticated, getUserId, getUserRole, getSessionCookie } = useAuth();
  const role = getUserRole();
  const id = getUserId();

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };
  const closeModal = (e) => {
    e.stopPropagation();
    setShowModal(false);
  };

  const handleEdit = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`${apiRoute}/papers/edit`, {
        cookie: getSessionCookie(),
        id: data.id,
        link,
        title,
      });

      if (res.status === 200) {
        toast.success(res.data);
        setRefresh(!refresh);
        setShowModal(false);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("Something went wrong. Try Again");
      }
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`${apiRoute}/papers/remove`, {
        cookie: getSessionCookie(),
        id: data.id,
      });

      if (res.status === 200) {
        toast.success(res.data);
        setRefresh(!refresh);
        setShowModal(false);
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
    <div className="paper-card">
      <h4>{data.title}</h4>
      <a
        href={data.link}
        target="_blank"
        rel="noreferrer"
        className="primary-action-button"
      >
        Download
      </a>
      <p>Shared by {data.user.name}</p>
      {authenticated && (role === "admin" || data.userId === id) && (
        <div className="actions">
          <button className="secondary-action-button" onClick={openModal}>
            Edit
          </button>
          <Modal show={showModal} onClose={closeModal}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEdit();
                }
              }}
              autoFocus={true}
            />
            <label>Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEdit();
                }
              }}
            />
            <button className="primary-action-button" onClick={handleEdit}>
              Save
            </button>
            <button className="secondary-action-button" onClick={closeModal}>
              Cancel
            </button>
          </Modal>
          {role === "admin" && (
            <button className="secondary-action-button" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaperCard;
