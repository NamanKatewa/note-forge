import axios from "axios";
import { apiRoute } from "../utils";
import SubjectCard from "../components/SubjectCard";
import "./Home.scss";
import authStore from "../authStore";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";

function Home() {
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());

  const savedSubjectsQuery = useQuery({
    queryKey: ["savedSubjectshome"],
    queryFn: () => {
      return axios.post(`${apiRoute}/subjects/getsaved`, {
        cookie: sessionCookie,
      });
    },
    enabled: authenticated,
  });

  if (savedSubjectsQuery.isLoading) return <Loader />;
  else
    return (
      <div className="home">
        {savedSubjectsQuery.data.data.length > 0 ? (
          <div className="section-grid">
            {savedSubjectsQuery.data.data.map((s, index) => {
              const colors = ["primary", "secondary", "muted", "accent"];
              const color = colors[index % colors.length];
              return (
                <SubjectCard key={s.id} data={s} saved={true} color={color} />
              );
            })}
          </div>
        ) : (
          <p>
            {authenticated
              ? "Save subjects to see them here."
              : "Login to add subjects"}
          </p>
        )}
      </div>
    );
}

export default Home;
