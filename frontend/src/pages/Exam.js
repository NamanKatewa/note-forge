import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { apiRoute, formatDeadline } from "../utils";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import PaperCard from "../components/PaperCard";
import "./Exam.scss";
import authStore from "../authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import modalStore from "../modalStore";
import Loader from "../components/Loader";

const Exam = () => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const { examId } = useParams();
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ["exam"],
    queryFn: () => {
      return axios.post(`${apiRoute}/exams/detail`, {
        id: examId,
      });
    },
  });

  const papersQuery = useQuery({
    queryKey: ["papers"],
    queryFn: () => {
      return axios.post(`${apiRoute}/papers/exam`, {
        examId,
      });
    },
  });

  const paperMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/papers/add`, {
        cookie: sessionCookie,
        title,
        link,
        examId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["papers"]);
      closeModal("createPaper");
      toast.success("Paper Added");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  if (detailQuery.isLoading || papersQuery.isLoading) return <Loader />;
  else
    return (
      <div className="exam">
        <h1>{detailQuery.data.data.subject.name}</h1>
        <h3>{detailQuery.data.data.title}</h3>
        <p>{formatDeadline(detailQuery.data.data.deadline)}</p>
        {authenticated ? (
          <div className="create-buttons">
            <button
              className="create-button"
              onClick={() => openModal("createPaper")}
            >
              Add Paper
            </button>
            <Modal id="createPaper">
              <label>Title</label>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Paper Title"
                autoFocus={true}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    paperMutation.mutate();
                  }
                }}
              />
              <label>Link</label>
              <input
                type="text"
                onChange={(e) => setLink(e.target.value)}
                placeholder="Catbox.moe link for the solution"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    paperMutation.mutate();
                  }
                }}
              />
              <button
                className="primary-action-button"
                onClick={() => paperMutation.mutate()}
                disabled={paperMutation.isPending}
              >
                {paperMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button
                className="secondary-action-button"
                onClick={() => closeModal("createPaper")}
              >
                Cancel
              </button>
            </Modal>
          </div>
        ) : (
          "Login to add your own solutions"
        )}
        {papersQuery.data.data.length > 0 ? (
          <div className="list">
            {papersQuery.data.data.map((s) => (
              <PaperCard key={s.id} data={s} />
            ))}
          </div>
        ) : (
          <h4>No papers yet</h4>
        )}
      </div>
    );
};

export default Exam;
