import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import BookCard from "../components/BookCard";
import "./Books.scss";
import authStore from "../authStore";

const Books = () => {
  const [showModal, setShowModal] = useState(false);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie);
  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [link, setLink] = useState("");
  const [resources, setResources] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const role = authStore((state) => state.getUserRole);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${apiRoute}/books/add`, {
        cookie: sessionCookie,
        title,
        imgUrl,
        link,
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

  const getBooks = async () => {
    const res = await axios.get(`${apiRoute}/books/all`);
    setResources(res.data);
  };

  useEffect(() => {
    getBooks();
  }, [refresh, authenticated]);

  return (
    <div className="books">
      {authenticated && role === "admin" && (
        <>
          <button className="create-button" onClick={openModal}>
            Create Books
          </button>
          <Modal show={showModal} onClose={closeModal}>
            <label>Title</label>
            <input
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
              placeholder="Book Title"
              autoFocus={true}
            />
            <label>Image</label>
            <input
              type="text"
              onChange={(e) => {
                setImgUrl(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
              placeholder="Book Image"
            />
            <label>Link</label>
            <input
              type="text"
              onChange={(e) => {
                setLink(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
              placeholder="Book Link"
            />
            <button onClick={handleCreate} className="primary-action-button">
              Create
            </button>
            <button className="secondary-action-button" onClick={closeModal}>
              Cancel
            </button>
          </Modal>
        </>
      )}

      <div className="section-grid">
        {resources &&
          resources.map((r, index) => {
            const colors = ["primary", "secondary", "muted", "accent"];
            const color = colors[index % colors.length];
            return (
              <BookCard
                key={r.id}
                data={r}
                setRefresh={setRefresh}
                refresh={refresh}
                color={color}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Books;
