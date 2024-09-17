import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import SubjectCard from "../components/SubjectCard";
import "./Subjects.scss";
import authStore from "../authStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loader from "../components/Loader";

const Subjects = () => {
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: () => {
      setTimeout(1000);
      return axios.get(`${apiRoute}/subjects/all`);
    },
  });

  const [showModal, setShowModal] = useState(false);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie);
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [savedSubjects, setSavedSubjects] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const role = authStore((state) => state.getUserRole);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${apiRoute}/subjects/add`, {
        cookie: sessionCookie,
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
        cookie: sessionCookie,
      });
      setSavedSubjects(res.data.subjects);
    };
    getSubjects();
    if (authenticated) {
      getSavedSubjects();
    }
  }, [refresh, authenticated, sessionCookie]);

  if (subjectsQuery.isLoading) return <Loader />;
  else if (subjectsQuery.isError) {
    window.location.reload();
  } else
    return (
      <div className="subjects">
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
          {subjectsQuery.data.data &&
            subjectsQuery.data.data.map((s, index) => {
              const colors = ["primary", "secondary", "muted", "accent"];
              const color = colors[index % colors.length];
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
                  color={color}
                />
              );
            })}
        </div>
      </div>
    );
};

export default Subjects;
