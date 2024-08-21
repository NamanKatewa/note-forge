import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth";
import Modal from "../components/Modal";
import DateTimePicker from "../components/DateTimePicker";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import AssignmentCard from "../components/AssignmentCard";

const Subject = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  const [refresh, setRefresh] = useState(false);
  const [futureAssignments, setFuture] = useState([]);
  const [pastAssignments, setPast] = useState([]);
  const { authenticated, getSessionCookie } = useAuth();
  const { subjectId, name } = useParams();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleDateTimeChange = (dateTimeString) => {
    setDateTime(dateTimeString);
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post(`${apiRoute}/assignments/add`, {
        cookie: getSessionCookie(),
        title,
        deadline: dateTime,
        subjectId,
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

  const getAssignments = async () => {
    const res = await axios.post(`${apiRoute}/assignments/subject`, {
      subjectId,
    });
    const { past, future } = sortAssignments(res.data);
    setFuture(future);
    setPast(past);
  };

  const sortAssignments = (assignments) => {
    const now = new Date();
    const past = [];
    const future = [];

    assignments.forEach((assignment) => {
      const deadline = new Date(assignment.deadline);
      if (deadline < now) {
        past.push(assignment);
      } else {
        future.push(assignment);
      }
    });

    past.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));

    return { past, future };
  };

  useEffect(() => {
    getAssignments();
  }, [refresh]);

  return (
    <div className="subject">
      <h1>{name}</h1>
      {authenticated ? (
        <>
          <button className="create-button" onClick={openModal}>
            Add Asignment
          </button>
          <Modal show={showModal} onClose={closeModal}>
            <input
              type="text"
              placeholder="Enter title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <DateTimePicker
              onDateTimeChange={handleDateTimeChange}
              text="Set deadline"
              initalTime=""
              initaliDate=""
            />
            <button className="primary-action-button" onClick={handleAdd}>
              Add
            </button>
            <button className="secondary-action-button" onClick={closeModal}>
              Cancel
            </button>
          </Modal>
        </>
      ) : (
        "Login to add assignments"
      )}

      {futureAssignments.length > 0 && (
        <div className="list">
          {futureAssignments.map((a) => (
            <AssignmentCard
              key={a.id}
              data={a}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          ))}
        </div>
      )}

      {pastAssignments.length > 0 && (
        <>
          <h3>Past Due Date</h3>
          <div className="list">
            {pastAssignments.map((a) => (
              <AssignmentCard
                key={a.id}
                data={a}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Subject;
