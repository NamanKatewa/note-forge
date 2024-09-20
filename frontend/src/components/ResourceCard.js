import React, { useState } from "react";
import { apiRoute } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { FilePen, Trash2 } from "lucide-react";
import "./ResourceCard.scss";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ResourceCard = ({ data, color }) => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);
  const [link, setLink] = useState(data.link);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/resources/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      toast.success("Resource Removed");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/resources/edit`, {
        cookie: sessionCookie,
        id: data.id,
        title,
        content,
        link,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      closeModal(`editResource${data.id}`);
      toast.success("Resource Edited");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div
      className={`resource-card ${color}`}
      onClick={() => {
        window.open(data.link, "_blank");
      }}
    >
      <div className="content">
        <h3>{data.title}</h3>
        <br />
        {data.content}
      </div>
      {authenticated && (
        <div className="actions">
          {role === "admin" && (
            <>
              <FilePen
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(`editResource${data.id}`);
                }}
              >
                Edit
              </FilePen>
              <Modal id={`editResource${data.id}`}>
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
                <button
                  className="secondary-action-button"
                  onClick={() => closeModal(`editResource${data.id}`)}
                >
                  Cancel
                </button>
              </Modal>
              <Trash2
                className="icon delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate();
                }}
              >
                Delete
              </Trash2>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
