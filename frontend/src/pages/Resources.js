import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import Modal from "../components/Modal";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import ResourceCard from "../components/ResourceCard";

const Resources = () => {
  const [showModal, setShowModal] = useState(false);
  const { authenticated, getSessionCookie, getUserRole } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [resources, setResources] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const role = getUserRole();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${apiRoute}/resources/add`, {
        cookie: getSessionCookie(),
        title,
        content,
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

  const getResources = async () => {
    const res = await axios.get(`${apiRoute}/resources/all`);
    setResources(res.data);
  };

  useEffect(() => {
    getResources();
  }, [refresh, authenticated]);

  return (
    <div className="page">
      {authenticated && role === "admin" && (
        <>
          <button className="create-button" onClick={openModal}>
            Create Resources
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
              placeholder="Resource Title"
              autoFocus={true}
            />
            <label>Content</label>
            <input
              type="text"
              onChange={(e) => {
                setContent(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
              placeholder="Resource Content"
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
              placeholder="Resource Link"
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

      <div className="list">
        {resources &&
          resources.map((r) => {
            return (
              <ResourceCard
                key={r.id}
                data={r}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Resources;
