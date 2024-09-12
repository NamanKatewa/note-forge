import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../auth";
import { apiRoute } from "../utils";
import Modal from "./Modal";
import { FilePen, Trash2 } from "lucide-react";
import "./NoteCard.scss";

const NoteCard = ({ data, refresh, setRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);
  const [link, setLink] = useState(data.link);
  const { getUserRole, authenticated, getSessionCookie, getUserId } = useAuth();
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
      const res = await axios.post(`${apiRoute}/notes/edit`, {
        cookie: getSessionCookie(),
        id: data.id,
        title,
        content,
        link,
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
      const res = await axios.post(`${apiRoute}/notes/remove`, {
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
    <div className="note-card" onClick={() => window.open(data.link, "_blank")}>
      <div className="content">
        <p> {data.title}</p>
        <p> {data.content}</p>
      </div>
      {authenticated && (role === "admin" || data.userId === id) && (
        <div className="actions">
          <FilePen className="icon" onClick={openModal} />
          <Modal show={showModal} onClose={closeModal}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEdit();
                }
              }}
            />
            <label>Content</label>
            <input
              type="text"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEdit();
                }
              }}
            />
            <label>Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
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

export default NoteCard;
