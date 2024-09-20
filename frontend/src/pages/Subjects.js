import "./Subjects.scss";
import { useState } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import SubjectCard from "../components/SubjectCard";
import authStore from "../authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";
import modalStore from "../modalStore";

const Subjects = () => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: () => {
      return axios.get(`${apiRoute}/subjects/all`);
    },
  });

  const savedSubjectsQuery = useQuery({
    queryKey: ["savedSubjects"],
    queryFn: () => {
      return axios.post(`${apiRoute}/subjects/getsaved`, {
        cookie: sessionCookie,
      });
    },
    enabled: authenticated,
  });

  const subjectMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/subjects/add`, {
        cookie: sessionCookie,
        name: name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      closeModal("createSubject");
      toast.success("Subject Added");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  if (subjectsQuery.isLoading || savedSubjectsQuery.isLoading)
    return <Loader />;
  else
    return (
      <div className="subjects">
        {authenticated && role === "admin" && (
          <>
            <button
              className="create-button"
              onClick={() => openModal("createSubject")}
            >
              Create Subject
            </button>
            <Modal id="createSubject">
              <label>Name</label>
              <input
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    subjectMutation.mutate();
                  }
                }}
                placeholder="Subject name"
                autoFocus={true}
              />
              <button
                onClick={() => subjectMutation.mutate()}
                className="primary-action-button"
                disabled={subjectMutation.isPending}
              >
                {subjectMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button
                className="secondary-action-button"
                onClick={() => closeModal("createSubject")}
              >
                Cancel
              </button>
            </Modal>
          </>
        )}

        <div className="section-grid">
          {subjectsQuery.data.data &&
            subjectsQuery.data.data.map((s, index) => {
              const colors = ["primary", "secondary", "muted", "accent"];
              const color = colors[index % colors.length];
              const isSaved = savedSubjectsQuery.data?.data.some(
                (savedSubject) => savedSubject.id === s.id
              );
              return (
                <SubjectCard
                  key={s.id}
                  data={s}
                  saved={isSaved}
                  color={color}
                />
              );
            })}
        </div>
      </div>
    );
};

export default Subjects;
