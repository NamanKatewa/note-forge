import React, { useState } from "react";
import "./AnnouncementCard.scss";
import modalStore from "../modalStore";
import authStore from "../authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import { FilePen, Trash2 } from "lucide-react";
import Modal from "./Modal";

const AnnouncementCard = ({ data }) => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const [title, setTitle] = useState(data.title);
  const [message, setMessage] = useState(data.message);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/announcements/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      toast.success("Announcement Removed");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/announcements/edit`, {
        cookie: sessionCookie,
        id: data.id,
        title: title,
        message: message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      closeModal(`editAnnouncement${data.id}`);
      toast.success("Announcement Edited");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="announcement-card">
      <div className="content">
        <h1>{data.title}</h1>
        <p>{data.message}</p>
      </div>

      {authenticated && role === "admin" && (
        <div className="actions">
          <div className="left">
            <FilePen
              className="icon edit"
              onClick={(e) => {
                e.stopPropagation();
                openModal(`editAnnouncement${data.id}`);
              }}
            />
            <Modal id={`editAnnouncement${data.id}`}>
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
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editMutation.mutate();
                  }
                }}
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
                onClick={() => closeModal(`editAnnouncement${data.id}`)}
              >
                Cancel
              </button>
            </Modal>
          </div>
          <div className="right">
            <Trash2
              className="icon delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteMutation.mutate();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
