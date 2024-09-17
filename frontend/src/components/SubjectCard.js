import React, { useState } from "react";
import { apiRoute } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { Bookmark, BookmarkCheck, FilePen, Trash2 } from "lucide-react";
import "./SubjectCard.scss";
import authStore from "../authStore";

const SubjectCard = ({ data, setRefresh, refresh, saved, color }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(data.name);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie);
  const role = authStore((state) => state.getUserRole);
  const navigate = useNavigate();

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };
  const closeModal = (e) => {
    e.stopPropagation();
    setShowModal(false);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`${apiRoute}/subjects/save`, {
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
        toast.error("Something went wrong Try Again");
      }
    }
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`${apiRoute}/subjects/removesave`, {
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
        toast.error("Something went wrong Try Again");
      }
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`${apiRoute}/subjects/remove`, {
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
      const res = await axios.post(`${apiRoute}/subjects/edit`, {
        cookie: sessionCookie,
        id: data.id,
        name,
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
      className={`card ${color}`}
      onClick={() => {
        navigate(`/subjects/${data.id}/${data.name}`);
      }}
    >
      <div className="content">{data.name}</div>
      {authenticated && (
        <div className="actions">
          {saved ? (
            <div className="left">
              <BookmarkCheck className="icon bookmark" onClick={handleRemove} />
            </div>
          ) : (
            <div className="left">
              <Bookmark className="icon bookmark" onClick={handleSave} />
            </div>
          )}

          {role === "admin" && (
            <div className="right">
              <FilePen className="icon edit" onClick={openModal} />
              <Modal show={showModal} onClose={closeModal}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
