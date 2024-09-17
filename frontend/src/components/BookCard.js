import React, { useState } from "react";
import { apiRoute } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { FilePen, Trash2 } from "lucide-react";
import "./BookCard.scss";
import authStore from "../authStore";

const BookCard = ({ data, setRefresh, refresh, color }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [imgUrl, setImgUrl] = useState(data.imgUrl);
  const [link, setLink] = useState(data.link);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie);
  const role = authStore((state) => state.getUserRole);

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };
  const closeModal = (e) => {
    e.stopPropagation();
    setShowModal(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`${apiRoute}/books/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });

      if (res.status === 200) {
        setRefresh(!refresh);
        toast.success(res.data);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("Something went wrong. Try Again");
      }
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axios.post(`${apiRoute}/books/edit`, {
        cookie: sessionCookie,
        id: data.id,
        title,
        imgUrl,
        link,
      });

      if (res.status === 200) {
        setRefresh(!refresh);
        toast.success(res.data);
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
    <div
      className={`book-card ${color}`}
      onClick={() => {
        window.open(data.link, "_blank");
      }}
    >
      <div className="content">
        <img src={data.imgUrl} alt={`${data.title} cover`} />
        <h3>{data.title}</h3>
      </div>
      {authenticated && (
        <div className="actions">
          {role === "admin" && (
            <>
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
                <label>Image</label>
                <input
                  type="text"
                  value={imgUrl}
                  onChange={(e) => {
                    setImgUrl(e.target.value);
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
                  Save Changes
                </button>
                <button
                  className="secondary-action-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </Modal>
              <Trash2 className="icon delete" onClick={handleDelete} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;
