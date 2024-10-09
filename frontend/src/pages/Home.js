import axios from "axios";
import { apiRoute } from "../utils";
import SubjectCard from "../components/SubjectCard";
import "./Home.scss";
import authStore from "../authStore";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import AssignmentCard from "../components/AssignmentCard";
import ExamCard from "../components/ExamCard";

function Home() {
  const authenticated = authStore((state) => state.authenticated);
  const sessionCookie = authStore((state) => state.getSessionCookie());

  const savedSubjectsQuery = useQuery({
    queryKey: ["savedSubjectshome"],
    queryFn: () => {
      return axios.post(`${apiRoute}/subjects/home`, {
        cookie: sessionCookie,
      });
    },
    enabled: authenticated,
    select: (data) => {
      const subjects = data.data;
      const assignments = [];
      const exams = [];

      subjects.forEach((subject) => {
        if (subject.assignments.length > 0) {
          Array.prototype.push.apply(assignments, subject.assignments);
        }
        if (subject.exams.length > 0) {
          Array.prototype.push.apply(exams, subject.exams);
        }
      });

      assignments.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      exams.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

      return {
        subjects: subjects,
        assignments: assignments,
        exams: exams,
      };
    },
  });

  if (savedSubjectsQuery.isLoading) return <Loader />;
  else
    return (
      <div className="home">
        {savedSubjectsQuery.data.subjects.length > 0 ? (
          <>
            {savedSubjectsQuery.data.assignments.length > 0 && (
              <>
                <h1>Assignments Due</h1>
                <div className="section-grid">
                  {savedSubjectsQuery.data.assignments.map((a) => {
                    return <AssignmentCard data={a} key={a.id} />;
                  })}
                </div>
              </>
            )}
            {savedSubjectsQuery.data.exams.length > 0 && (
              <>
                <h1>Upcoming Exams</h1>
                <div className="section-grid">
                  {savedSubjectsQuery.data.exams.map((e) => {
                    return <ExamCard data={e} key={e.id} />;
                  })}
                </div>
              </>
            )}
            <h1>Subjects</h1>
            <div className="section-grid">
              {savedSubjectsQuery.data.subjects.map((s, index) => {
                const colors = ["primary", "secondary", "muted", "accent"];
                const color = colors[index % colors.length];
                return (
                  <SubjectCard key={s.id} data={s} saved={true} color={color} />
                );
              })}
            </div>
          </>
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
