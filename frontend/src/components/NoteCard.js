import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { apiRoute } from "../utils";
import Modal from "./Modal";
import { FilePen, Trash2 } from "lucide-react";
import "./NoteCard.scss";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NoteCard = ({ data }) => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const id = authStore((state) => state.getUserId());
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);
  const [link, setLink] = useState(data.link);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/notes/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      toast.success("Note Removed");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/notes/edit`, {
        cookie: sessionCookie,
        id: data.id,
        title,
        content,
        link,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      closeModal(`editNote${data.id}`);
      toast.success("Note Edited");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="note-card" onClick={() => window.open(data.link, "_blank")}>
      <div className="content">
        <p> {data.title}</p>
        <p> {data.content}</p>
      </div>
      {authenticated && (role === "admin" || data.userId === id) && (
        <div className="actions">
          <FilePen
            className="icon"
            onClick={(e) => {
              e.stopPropagation();
              openModal(`editNote${data.id}`);
            }}
          />
          <Modal id={`editNote${data.id}`}>
            <label>Title</label>
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
            <label>Content</label>
            <input
              type="text"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editMutation.mutate();
                }
              }}
            />
            <label>Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
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
            <button className="secondary-action-button" onClick={closeModal}>
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

export default NoteCard;
