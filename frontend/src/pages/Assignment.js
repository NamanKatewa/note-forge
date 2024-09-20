import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { apiRoute, formatDeadline } from "../utils";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import SolutionCard from "../components/SolutionCard";
import "./Assignment.scss";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";

const Assignment = () => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const { assignmentId } = useParams();
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ["assignment"],
    queryFn: () => {
      return axios.post(`${apiRoute}/assignments/detail`, {
        id: assignmentId,
      });
    },
  });

  const solutionsQuery = useQuery({
    queryKey: ["solutions"],
    queryFn: () => {
      return axios.post(`${apiRoute}/solution/assignment`, {
        assignmentId,
      });
    },
  });

  const solutionMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/solution/add`, {
        cookie: sessionCookie,
        content,
        link,
        assignmentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["solutions"]);
      closeModal("createSolution");
      toast.success("Solution Added");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  if (detailQuery.isLoading || solutionsQuery.isLoading) return <Loader />;
  else
    return (
      <div className="assignment">
        <h1>{detailQuery.data.data.subject.name}</h1>
        <h3>{detailQuery.data.data.title}</h3>
        <p>{formatDeadline(detailQuery.data.data.deadline)}</p>
        {authenticated ? (
          <div className="create-buttons">
            <button
              className="create-button"
              onClick={() => openModal("createSolution")}
            >
              Add Solution
            </button>
            <Modal id="createSolution">
              <input
                type="text"
                onChange={(e) => setContent(e.target.value)}
                placeholder="Solution Description"
                autoFocus={true}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    solutionMutation.mutate();
                  }
                }}
              />
              <input
                type="text"
                onChange={(e) => setLink(e.target.value)}
                placeholder="Catbox.moe link for the solution"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    solutionMutation.mutate();
                  }
                }}
              />
              <button
                className="primary-action-button"
                onClick={() => solutionMutation.mutate()}
                disabled={solutionMutation.isPending}
              >
                {solutionMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button
                className="secondary-action-button"
                onClick={() => closeModal("createSolution")}
              >
                Cancel
              </button>
            </Modal>
          </div>
        ) : (
          "Login to add your own solutions"
        )}
        {solutionsQuery.data.data.length > 0 ? (
          <div className="list">
            {solutionsQuery.data.data.map((s) => (
              <SolutionCard key={s.id} data={s} />
            ))}
          </div>
        ) : (
          <h4>No solutions yet</h4>
        )}
      </div>
    );
};

export default Assignment;
