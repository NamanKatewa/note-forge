import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import Modal from "../components/Modal";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import SubjectCard from "../components/SubjectCardNew";
import "./Subjects.scss";

const Subjects = () => {
  const [showModal, setShowModal] = useState(false);
  const { authenticated, getSessionCookie, getUserRole } = useAuth();
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [savedSubjects, setSavedSubjects] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const role = getUserRole();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${apiRoute}/subjects/add`, {
        cookie: getSessionCookie(),
        name,
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
    const getSubjects = async () => {
      const res = await axios.get(`${apiRoute}/subjects/all`);
      setSubjects(res.data);
    };

    const getSavedSubjects = async () => {
      const res = await axios.post(`${apiRoute}/subjects/getsaved`, {
        cookie: getSessionCookie(),
      });
      setSavedSubjects(res.data.subjects);
    };
    getSubjects();
    if (authenticated) {
      getSavedSubjects();
    }
  }, [refresh, authenticated, getSessionCookie]);

  return (
    <div className="page">
      {authenticated && role === "admin" && (
        <>
          <button className="create-button" onClick={openModal}>
            Create Subject
          </button>
          <Modal show={showModal} onClose={closeModal}>
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
              placeholder="Subject name"
              autoFocus={true}
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
        {subjects &&
          subjects.map((s) => {
            const isSaved = savedSubjects.some(
              (savedSubject) => savedSubject.id === s.id
            );
            return (
              <SubjectCard
                key={s.id}
                data={s}
                saved={isSaved}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Subjects;
