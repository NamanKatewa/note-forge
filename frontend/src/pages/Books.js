import React, { useState } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import BookCard from "../components/BookCard";
import "./Books.scss";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";

const Books = () => {
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie);
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const role = authStore((state) => state.getUserRole());
  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [link, setLink] = useState("");
  const queryClient = useQueryClient();

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: () => {
      return axios.get(`${apiRoute}/books/all`);
    },
  });

  const bookMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/books/add`, {
        cookie: sessionCookie,
        title,
        imgUrl,
        link,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      closeModal("createBook");
      toast.success("Book Added");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  if (booksQuery.isLoading) return <Loader />;
  else
    return (
      <div className="books">
        {authenticated && role === "admin" && (
          <>
            <button
              className="create-button"
              onClick={() => openModal("createBook")}
            >
              Create Book
            </button>
            <Modal id="createBook">
              <label>Title</label>
              <input
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    bookMutation.mutate();
                  }
                }}
                placeholder="Book Title"
                autoFocus={true}
              />
              <label>Image</label>
              <input
                type="text"
                onChange={(e) => {
                  setImgUrl(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    bookMutation.mutate();
                  }
                }}
                placeholder="Book Image"
              />
              <label>Link</label>
              <input
                type="text"
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    bookMutation.mutate();
                  }
                }}
                placeholder="Book Link"
              />
              <button
                onClick={() => bookMutation.mutate()}
                className="primary-action-button"
                disabled={bookMutation.isPending}
              >
                {bookMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button className="secondary-action-button" onClick={closeModal}>
                Cancel
              </button>
            </Modal>
          </>
        )}

        <div className="section-grid">
          {booksQuery.data.data &&
            booksQuery.data.data.map((r, index) => {
              const colors = ["primary", "secondary", "muted", "accent"];
              const color = colors[index % colors.length];
              return <BookCard key={r.id} data={r} color={color} />;
            })}
        </div>
      </div>
    );
};

export default Books;
