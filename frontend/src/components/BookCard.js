import React, { useState } from "react";
import { apiRoute } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { FilePen, Trash2 } from "lucide-react";
import "./BookCard.scss";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const BookCard = ({ data, color }) => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const [title, setTitle] = useState(data.title);
  const [imgUrl, setImgUrl] = useState(data.imgUrl);
  const [link, setLink] = useState(data.link);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/books/remove`, {
        cookie: sessionCookie,
        id: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success("Book Removed");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/books/edit`, {
        cookie: sessionCookie,
        id: data.id,
        title,
        imgUrl,
        link,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      closeModal(`editBook${data.id}`);
      toast.success("Book Edited");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div
      className={`book-card ${color}`}
      onClick={() => {
        window.open(data.link, "_blank");
      }}
    >
      <div className="content">
        <img src={data.imgUrl} alt={`${data.title} cover`} />
        <h3>{data.title}</h3>
      </div>
      {authenticated && (
        <div className="actions">
          {role === "admin" && (
            <>
              <FilePen
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(`editBook${data.id}`);
                }}
              />
              <Modal id={`editBook${data.id}`}>
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
                <label>Image</label>
                <input
                  type="text"
                  value={imgUrl}
                  onChange={(e) => {
                    setImgUrl(e.target.value);
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
                  onClick={() => closeModal(`editBook${data.id}`)}
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;
