import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { apiRoute } from "../utils";
import Modal from "./Modal";
import { FilePen, Trash2 } from "lucide-react";
import "./PaperCard.scss";
import authStore from "../authStore";

const PaperCard = ({ data, refresh, setRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [link, setLink] = useState(data.link);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie);
  const role = authStore((state) => state.getUserRole);
  const id = authStore((state) => state.getUserId);

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
        cookie: sessionCookie,
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
        cookie: sessionCookie,
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
      <div className="content">
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
      </div>
      {authenticated && (role === "admin" || data.userId === id) && (
        <div className="actions">
          <FilePen className="icon" onClick={openModal} />
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
            <Trash2 className="icon delete" onClick={handleDelete} />
          )}
        </div>
      )}
    </div>
  );
};

export default PaperCard;
