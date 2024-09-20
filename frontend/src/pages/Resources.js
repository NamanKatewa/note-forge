import "./Resources.scss";
import { useState } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import ResourceCard from "../components/ResourceCard";
import authStore from "../authStore";
import modalStore from "../modalStore";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import Loader from "../components/Loader";

const Resources = () => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const queryClient = useQueryClient();

  const resourcesQuery = useQuery({
    queryKey: ["resources"],
    queryFn: () => {
      return axios.get(`${apiRoute}/resources/all`);
    },
  });

  const resourceMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/resources/add`, {
        cookie: sessionCookie,
        title: title,
        content: content,
        link: link,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      closeModal("createResource");
      toast.success("Resource Added");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  if (resourcesQuery.isLoading) return <Loader />;
  else
    return (
      <div className="resources">
        {authenticated && role === "admin" && (
          <>
            <button
              className="create-button"
              onClick={() => openModal("createResource")}
            >
              Create Resources
            </button>
            <Modal id="createResource">
              <label>Title</label>
              <input
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    resourceMutation.mutate();
                  }
                }}
                placeholder="Resource Title"
                autoFocus={true}
              />
              <label>Content</label>
              <input
                type="text"
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    resourceMutation.mutate();
                  }
                }}
                placeholder="Resource Content"
              />
              <label>Link</label>
              <input
                type="text"
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    resourceMutation.mutate();
                  }
                }}
                placeholder="Resource Link"
              />
              <button
                onClick={() => resourceMutation.mutate()}
                className="primary-action-button"
                disabled={resourceMutation.isPending}
              >
                {resourceMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button className="secondary-action-button" onClick={closeModal}>
                Cancel
              </button>
            </Modal>
          </>
        )}

        <div className="section-grid">
          {resourcesQuery.data.data &&
            resourcesQuery.data.data.map((r, index) => {
              const colors = ["primary", "secondary", "muted", "accent"];
              const color = colors[index % colors.length];
              return <ResourceCard key={r.id} data={r} color={color} />;
            })}
        </div>
      </div>
    );
};

export default Resources;
