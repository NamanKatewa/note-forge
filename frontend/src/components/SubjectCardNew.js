import React, { useState } from "react";
import { useAuth } from "../auth";
import { apiRoute } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { Bookmark, BookmarkCheck } from "lucide-react";
import "./SubjectCard.scss";

const SubjectCard = ({ data, setRefresh, refresh, saved }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(data.name);
  const { authenticated, getSessionCookie, getUserRole } = useAuth();
  const role = getUserRole();
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
        cookie: getSessionCookie(),
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
        cookie: getSessionCookie(),
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
        cookie: getSessionCookie(),
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
        cookie: getSessionCookie(),
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
      className="subject-card"
      onClick={() => {
        navigate(`/subjects/${data.id}/${data.name}`);
      }}
    >
      {data.name}
      {authenticated && (
        <div className="actions">
          {saved ? (
            <svg
              onClick={handleRemove}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              onClick={handleSave}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          )}

          {role === "admin" && (
            <>
              <button className="secondary-action-button" onClick={openModal}>
                Edit
              </button>
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
              <button
                className="secondary-action-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
