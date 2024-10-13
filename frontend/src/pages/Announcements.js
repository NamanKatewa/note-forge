import "./Announcements.scss";
import { useState } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import { apiRoute } from "../utils";
import toast from "react-hot-toast";
import AnnouncementCard from "../components/AnnouncementCard";
import authStore from "../authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";
import modalStore from "../modalStore";

const Announcements = () => {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());
  const role = authStore((state) => state.getUserRole());
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const announcementsQuery = useQuery({
    queryKey: ["announcements"],
    queryFn: () => {
      return axios.get(`${apiRoute}/announcements/all`);
    },
  });

  const announcementMutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiRoute}/announcements/add`, {
        cookie: sessionCookie,
        title: title,
        message: message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      closeModal("createAnnouncement");
      toast.success("Announcement Created");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  if (announcementsQuery.isLoading) return <Loader />;
  else
    return (
      <div className="announcements">
        {authenticated && role === "admin" && (
          <>
            <button
              className="create-button"
              onClick={() => openModal("createAnnouncement")}
            >
              Create Announcement
            </button>
            <Modal id="createAnnouncement">
              <label>Title</label>
              <input
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    announcementMutation.mutate();
                  }
                }}
                placeholder="Announcement title"
                autoFocus={true}
              />
              <input
                type="text"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    announcementMutation.mutate();
                  }
                }}
                placeholder="Announcement message"
              />
              <button
                onClick={() => announcementMutation.mutate()}
                className="primary-action-button"
                disabled={announcementMutation.isPending}
              >
                {announcementMutation.isPending ? "Creating..." : "Create"}
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

        {announcementsQuery.data.data.length > 0 ? (
          <div className="section-grid">
            {announcementsQuery.data.data &&
              announcementsQuery.data.data.map((a) => (
                <AnnouncementCard key={a.id} data={a} />
              ))}
          </div>
        ) : (
          <div className="section">No Announcements</div>
        )}
      </div>
    );
};

export default Announcements;
