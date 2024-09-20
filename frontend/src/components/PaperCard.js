import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { apiRoute } from "../utils";
import Modal from "./Modal";
import { FilePen, Trash2 } from "lucide-react";
import "./PaperCard.scss";
import authStore from "../authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import modalStore from "../modalStore";

const PaperCard = ({ data }) => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const [title, setTitle] = useState(data.title);
  const [link, setLink] = useState(data.link);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const id = authStore((state) => state.getUserId());
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/papers/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["papers"]);
      toast.success("Paper Removed");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/papers/edit`, {
        cookie: sessionCookie,
        id: data.id,
        link,
        title,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["papers"]);
      closeModal(`editPaper${data.id}`);
      toast.success("Paper Edited");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="paper-card">
      <div className="content">
        <h4>{data.title}</h4>
        <a
          href={data.link}
          target="_blank"
          rel="noreferrer"
          className="primary-action-button"
        >
          Download
        </a>
        <p>Shared by {data.user.name}</p>
      </div>
      {authenticated && (role === "admin" || data.userId === id) && (
        <div className="actions">
          <FilePen
            className="icon"
            onClick={(e) => {
              e.stopPropagation();
              openModal(`editPaper${data.id}`);
            }}
          />
          <Modal id={`editPaper${data.id}`}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editMutation.mutate();
                }
              }}
              autoFocus={true}
            />
            <label>Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
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
              onClick={() => closeModal(`editPaper${data.id}`)}
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

export default PaperCard;
