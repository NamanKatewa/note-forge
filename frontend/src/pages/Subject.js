import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth";
import Modal from "../components/Modal";
import DateTimePicker from "../components/DateTimePicker";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import AssignmentCard from "../components/AssignmentCard";
import ExamCard from "../components/ExamCard";
import NoteCard from "../components/NoteCard";

const Subject = () => {
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDateTime, setAssignmentDateTime] = useState({
    date: "",
    time: "",
  });
  const [examTitle, setExamTitle] = useState("");
  const [examDateTime, setExamDateTime] = useState({ date: "", time: "" });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteLink, setNoteLink] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [futureAssignments, setAssignmentFuture] = useState([]);
  const [pastAssignments, setAssignmentPast] = useState([]);
  const [futureExams, setExamFuture] = useState([]);
  const [pastExams, setExamPast] = useState([]);
  const [notes, setNotes] = useState([]);
  const { authenticated, getSessionCookie } = useAuth();
  const { subjectId, name } = useParams();

  const openAssignmentModal = () => setShowAssignmentModal(true);
  const closeAssignmentModal = () => setShowAssignmentModal(false);
  const openExamModal = () => setShowExamModal(true);
  const closeExamModal = () => setShowExamModal(false);
  const openNoteModal = () => setShowNoteModal(true);
  const closeNoteModal = () => setShowNoteModal(false);

  const handleAssignmentDateTimeChange = (dateTimeString) => {
    setAssignmentDateTime(dateTimeString);
  };
  const handleExamDateTimeChange = (dateTimeString) => {
    setExamDateTime(dateTimeString);
  };

  const handleAddAssignment = async () => {
    if (assignmentDateTime.date === "" || assignmentDateTime.time === "") {
      toast.error("Deadline is required");
    } else {
      try {
        const res = await axios.post(`${apiRoute}/assignments/add`, {
          cookie: getSessionCookie(),
          title: assignmentTitle,
          deadline: assignmentDateTime,
          subjectId,
        });

        if (res.status === 200) {
          toast.success(res.data);
          setRefresh(!refresh);
          closeAssignmentModal();
        }
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(err.response.data);
        } else {
          toast.error("Something went wrong. Try Again");
        }
      }
    }
  };
  const handleAddExam = async () => {
    if (examDateTime.date === "" || examDateTime.time === "") {
      toast.error("Deadline is required");
    } else {
      try {
        const res = await axios.post(`${apiRoute}/exams/add`, {
          cookie: getSessionCookie(),
          title: examTitle,
          deadline: examDateTime,
          subjectId,
        });

        if (res.status === 200) {
          toast.success(res.data);
          setRefresh(!refresh);
          closeExamModal();
        }
      } catch (err) {
        if (err.response && err.response.data) {
          toast.error(err.response.data);
        } else {
          toast.error("Something went wrong. Try Again");
        }
      }
    }
  };
  const handleAddNote = async () => {
    try {
      const res = await axios.post(`${apiRoute}/notes/add`, {
        cookie: getSessionCookie(),
        title: noteTitle,
        content: noteContent,
        link: noteLink,
        subjectId,
      });

      if (res.status === 200) {
        toast.success(res.data);
        setRefresh(!refresh);
        closeNoteModal();
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("Something went wrong. Try Again");
      }
    }
  };

  const sort = (items) => {
    const now = new Date();
    const past = [];
    const future = [];

    items.forEach((item) => {
      const deadline = new Date(item.deadline);
      if (deadline < now) {
        past.push(item);
      } else {
        future.push(item);
      }
    });

    past.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));

    return { past, future };
  };

  useEffect(() => {
    const getAssignments = async () => {
      const res = await axios.post(`${apiRoute}/assignments/subject`, {
        subjectId,
      });
      const { past, future } = sort(res.data);
      setAssignmentFuture(future);
      setAssignmentPast(past);
    };
    const getNotes = async () => {
      const res = await axios.post(`${apiRoute}/notes/subject`, {
        subjectId,
      });
      setNotes(res.data);
    };
    const getExams = async () => {
      const res = await axios.post(`${apiRoute}/exams/subject`, {
        subjectId,
      });
      const { past, future } = sort(res.data);
      setExamFuture(future);
      setExamPast(past);
    };
    getAssignments();
    getNotes();
    getExams();
  }, [refresh, subjectId]);

  return (
    <div className="subject">
      <h1>{name}</h1>
      {authenticated ? (
        <>
          <div className="createButtons">
            <button className="create-button" onClick={openAssignmentModal}>
              Add Asignment
            </button>
            <button className="create-button" onClick={openNoteModal}>
              Add Notes
            </button>
            <button className="create-button" onClick={openExamModal}>
              Add Exams
            </button>
          </div>
          <Modal show={showAssignmentModal} onClose={closeAssignmentModal}>
            <label>Assignment Title</label>
            <input
              type="text"
              placeholder="Enter title"
              onChange={(e) => setAssignmentTitle(e.target.value)}
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddAssignment();
                }
              }}
            />
            <DateTimePicker
              onDateTimeChange={handleAssignmentDateTimeChange}
              text="Set deadline"
              initalTime=""
              initaliDate=""
            />
            <button
              className="primary-action-button"
              onClick={handleAddAssignment}
            >
              Add
            </button>
            <button
              className="secondary-action-button"
              onClick={closeAssignmentModal}
            >
              Cancel
            </button>
          </Modal>
          <Modal show={showExamModal} onClose={closeExamModal}>
            <label>Exam Title</label>
            <input
              type="text"
              placeholder="Enter title"
              onChange={(e) => setExamTitle(e.target.value)}
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddExam();
                }
              }}
            />
            <DateTimePicker
              onDateTimeChange={handleExamDateTimeChange}
              text="Set deadline"
              initalTime=""
              initaliDate=""
            />
            <button className="primary-action-button" onClick={handleAddExam}>
              Add
            </button>
            <button
              className="secondary-action-button"
              onClick={closeExamModal}
            >
              Cancel
            </button>
          </Modal>
          <Modal show={showNoteModal} onClose={closeNoteModal}>
            <label>Note Title</label>
            <input
              type="text"
              placeholder="Enter title"
              autoFocus={true}
              onChange={(e) => setNoteTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddNote();
                }
              }}
            />
            <label>Note Content</label>
            <input
              type="text"
              placeholder="Enter content"
              onChange={(e) => setNoteContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddNote();
                }
              }}
            />
            <label>Note Link</label>
            <input
              type="text"
              placeholder="Enter link"
              onChange={(e) => setNoteLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddNote();
                }
              }}
            />
            <button className="primary-action-button" onClick={handleAddNote}>
              Add
            </button>
            <button
              className="secondary-action-button"
              onClick={closeNoteModal}
            >
              Cancel
            </button>
          </Modal>
        </>
      ) : (
        <div>Login to add assignments, notes and exams</div>
      )}

      <h2>Assignments</h2>

      {futureAssignments.length > 0 ? (
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
      ) : (
        <div>No assignments due</div>
      )}
      {pastAssignments.length > 0 ? (
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
      ) : (
        <div>No past assignments.</div>
      )}

      <h2>Exams</h2>

      {futureExams.length > 0 ? (
        <>
          <div className="list">
            {futureExams.map((e) => (
              <ExamCard
                key={e.id}
                data={e}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            ))}
          </div>
        </>
      ) : (
        <div>No upcoming exams</div>
      )}
      {pastExams.length > 0 ? (
        <>
          <h3>Past Exams</h3>
          {pastExams.map((e) => (
            <ExamCard
              key={e.id}
              data={e}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          ))}
        </>
      ) : (
        <div>No past exams</div>
      )}
      <h2>Notes</h2>
      {notes.length > 0 ? (
        <>
          <div className="list">
            {notes.map((n) => (
              <NoteCard
                key={n.id}
                data={n}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            ))}
          </div>
        </>
      ) : (
        <div>No Notes</div>
      )}
    </div>
  );
};

export default Subject;
