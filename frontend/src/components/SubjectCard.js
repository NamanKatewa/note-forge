import React, { useState } from "react";
import { apiRoute } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { Bookmark, BookmarkCheck, FilePen, Trash2 } from "lucide-react";
import "./SubjectCard.scss";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SubjectCard = ({ data, saved, color }) => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const [name, setName] = useState(data.name);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/subjects/save`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["savedSubjects"]);
      toast.success("Subject Saved");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const removeSaveMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/subjects/removesave`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["savedSubjects"]);
      toast.success("Subject Unsaved");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/subjects/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      toast.success("Subject Removed");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/subjects/edit`, {
        cookie: sessionCookie,
        id: data.id,
        name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      closeModal(`editSubject${data.id}`);
      toast.success("Subject Edited");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div
      className={`card ${color}`}
      onClick={() => {
        navigate(`/subjects/${data.id}/${data.name}`);
      }}
    >
      <div className="content">{data.name}</div>
      {authenticated && (
        <div className="actions">
          {saved ? (
            <div className="left">
              <BookmarkCheck
                className="icon bookmark"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSaveMutation.mutate();
                }}
              />
            </div>
          ) : (
            <div className="left">
              <Bookmark
                className="icon bookmark"
                onClick={(e) => {
                  e.stopPropagation();
                  saveMutation.mutate();
                }}
              />
            </div>
          )}

          {role === "admin" && (
            <div className="right">
              <FilePen
                className="icon edit"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(`editSubject${data.id}`);
                }}
              />
              <Modal id={`editSubject${data.id}`}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      editMutation.mutate();
                    }
                  }}
                  autoFocus={true}
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
                  onClick={() => closeModal(`editSubject${data.id}`)}
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
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
