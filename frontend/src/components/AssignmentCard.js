import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDateTime, formatDeadline } from "../utils";
import authStore from "../authStore";
import { apiRoute } from "../utils";
import Modal from "./Modal";
import DateTimePicker from "./DateTimePicker";
import { FilePen, Trash2 } from "lucide-react";
import "./AssignmentCard.scss";
import modalStore from "../modalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AssignmentCard = ({ data }) => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const authenticated = authStore((state) => state.authenticated);
  const role = authStore((state) => state.getUserRole());
  const id = authStore((state) => state.getUserId());
  const [title, setTitle] = useState(data.title);
  const [deadline, setDeadline] = useState("");
  const { formattedDate, formattedTime } = formatDateTime(data.deadline);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/assignments/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignments"]);
      toast.success("Assignment Removed");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/assignments/edit`, {
        cookie: sessionCookie,
        id: data.id,
        title,
        deadline,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignments"]);
      closeModal(`editAssignment${data.id}`);
      toast.success("Assignment Edited");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div
      className="assignment-card"
      onClick={() => navigate(`/assignments/${data.id}`)}
    >
      <div className="content">
        <p> {data.title}</p>
        <p> {formatDeadline(data.deadline)}</p>
      </div>
      {authenticated && (role === "admin" || data.userId === id) && (
        <div className="actions">
          <FilePen
            className="icon"
            onClick={(e) => {
              e.stopPropagation();
              openModal(`editAssignment${data.id}`);
            }}
          />
          <Modal id={`editAssignment${data.id}`}>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editMutation.mutate();
                }
              }}
              autoFocus={true}
            />
            <DateTimePicker
              onDateTimeChange={setDeadline}
              text="Edit deadline"
              initialDate={formattedDate}
              initialTime={formattedTime}
            />
            <button
              className="primary-action-button"
              onClick={() => editMutation.mutate()}
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="secondary-action-button"
              onClick={() => closeModal(`editAssignment${data.id}`)}
            >
              Cancel
            </button>
          </Modal>
          {role === "admin" && (
            <Trash2
              className="icon delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteMutation.mutate();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
