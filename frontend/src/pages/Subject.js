import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import DateTimePicker from "../components/DateTimePicker";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import AssignmentCard from "../components/AssignmentCard";
import ExamCard from "../components/ExamCard";
import NoteCard from "../components/NoteCard";
import "./Subject.scss";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";

const Subject = () => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
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
  const { subjectId, name } = useParams();
  const queryClient = useQueryClient();

  const assignmentsQuery = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const res = await axios.post(`${apiRoute}/assignments/subject`, {
        subjectId,
      });
      const { past, future } = sort(res.data);
      return { past, future };
    },
  });
  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: () => {
      return axios.post(`${apiRoute}/notes/subject`, {
        subjectId,
      });
    },
  });
  const examsQuery = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await axios.post(`${apiRoute}/exams/subject`, {
        subjectId,
      });
      const { past, future } = sort(res.data);
      return { past, future };
    },
  });

  const assignmentMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/assignments/add`, {
        cookie: sessionCookie,
        title: assignmentTitle,
        deadline: assignmentDateTime,
        subjectId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignments"]);
      closeModal("createAssignment");
      toast.success("Assignment Added");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const examMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/exams/add`, {
        cookie: sessionCookie,
        title: examTitle,
        deadline: examDateTime,
        subjectId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["exams"]);
      closeModal("createExam");
      toast.success("Exam Added");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const noteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/notes/add`, {
        cookie: sessionCookie,
        title: noteTitle,
        content: noteContent,
        link: noteLink,
        subjectId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      closeModal("createNote");
      toast.success("Note Added");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

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

  if (
    assignmentsQuery.isLoading ||
    notesQuery.isLoading ||
    examsQuery.isLoading
  )
    return <Loader />;
  else {
    const { past: pastAssignments, future: futureAssignments } =
      assignmentsQuery.data || { past: [], future: [] };
    const { past: pastExams, future: futureExams } = examsQuery.data || {
      past: [],
      future: [],
    };
    return (
      <div className="subject">
        <h1>{name}</h1>
        {authenticated ? (
          <>
            <div className="create-buttons">
              <button
                className="create-button"
                onClick={() => openModal("createAssignment")}
              >
                Add Assignment
              </button>
              <button
                className="create-button"
                onClick={() => openModal("createExam")}
              >
                Add Exams
              </button>
              <button
                className="create-button"
                onClick={() => openModal("createNote")}
              >
                Add Notes
              </button>
            </div>
            <Modal id="createAssignment">
              <label>Assignment Title</label>
              <input
                type="text"
                placeholder="Enter title"
                onChange={(e) => setAssignmentTitle(e.target.value)}
                autoFocus={true}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    assignmentMutation.mutate();
                  }
                }}
              />
              <DateTimePicker
                onDateTimeChange={(dateTimeString) =>
                  setAssignmentDateTime(dateTimeString)
                }
                text="Set deadline"
                initalTime=""
                initaliDate=""
              />
              <button
                className="primary-action-button"
                onClick={() => assignmentMutation.mutate()}
                disabled={assignmentMutation.isPending}
              >
                {assignmentMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button
                className="secondary-action-button"
                onClick={() => closeModal("createAssignment")}
              >
                Cancel
              </button>
            </Modal>
            <Modal id="createExam">
              <label>Exam Title</label>
              <input
                type="text"
                placeholder="Enter title"
                onChange={(e) => setExamTitle(e.target.value)}
                autoFocus={true}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    examMutation.mutate();
                  }
                }}
              />
              <DateTimePicker
                onDateTimeChange={(dateTimeString) =>
                  setExamDateTime(dateTimeString)
                }
                text="Set deadline"
                initalTime=""
                initaliDate=""
              />
              <button
                className="primary-action-button"
                onClick={() => examMutation.mutate()}
                disabled={examMutation.isPending}
              >
                {examMutation.isPending ? "Creating..." : "Create"}{" "}
              </button>
              <button
                className="secondary-action-button"
                onClick={() => closeModal("createExam")}
              >
                Cancel
              </button>
            </Modal>
            <Modal id="createNote">
              <label>Note Title</label>
              <input
                type="text"
                placeholder="Enter title"
                autoFocus={true}
                onChange={(e) => setNoteTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    noteMutation.mutate();
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
                    noteMutation.mutate();
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
                    noteMutation.mutate();
                  }
                }}
              />
              <button
                className="primary-action-button"
                onClick={() => noteMutation.mutate()}
                disabled={noteMutation.isPending}
              >
                {noteMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button
                className="secondary-action-button"
                onClick={() => closeModal("createNote")}
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
              <AssignmentCard key={a.id} data={a} />
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
                <AssignmentCard key={a.id} data={a} />
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
                <ExamCard key={e.id} data={e} />
              ))}
            </div>
          </>
        ) : (
          <div>No upcoming exams</div>
        )}
        {pastExams.length > 0 ? (
          <>
            <h2>Past Exams</h2>
            <div className="list">
              {pastExams.map((e) => (
                <ExamCard key={e.id} data={e} />
              ))}
            </div>
          </>
        ) : (
          <div>No past exams</div>
        )}
        <h2>Notes</h2>
        {notesQuery.data.data.length > 0 ? (
          <>
            <div className="list">
              {notesQuery.data.data.map((n) => (
                <NoteCard key={n.id} data={n} />
              ))}
            </div>
          </>
        ) : (
          <div>No Notes</div>
        )}
      </div>
    );
  }
};

export default Subject;
