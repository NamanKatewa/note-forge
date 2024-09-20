import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { apiRoute } from "../utils";
import Modal from "./Modal";
import { FilePen, Trash2 } from "lucide-react";
import "./SolutionCard.scss";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SolutionCard = ({ data }) => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const id = authStore((state) => state.getUserId());
  const [content, setContent] = useState(data.content);
  const [link, setLink] = useState(data.link);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/solution/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["solutions"]);
      toast.success("Solution Removed");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/solution/edit`, {
        cookie: sessionCookie,
        id: data.id,
        link,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["solutions"]);
      closeModal(`editSolution${data.id}`);
      toast.success("Solution Edited");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="solution-card">
      <div className="content">
        <h4>{data.content}</h4>
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
              openModal(`editSolution${data.id}`);
            }}
          />
          <Modal id={`editSolution${data.id}`}>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editMutation.mutate();
                }
              }}
              autoFocus={true}
            />
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
              onClick={() => closeModal(`editSolution${data.id}`)}
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

export default SolutionCard;
