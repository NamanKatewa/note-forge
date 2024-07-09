import { useEffect, useState } from "react";
import axios from "axios";
import { apiRoute } from "../utils";
import { useAuth } from "../auth";
import SubjectCard from "../components/SubjectCard";

function Home() {
  const { getSessionCookie, authenticated } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const res = await axios.post(`${apiRoute}/subjects/getsaved`, {
          cookie: getSessionCookie(),
        });
        setSubjects(res.data.subjects);
      } catch (err) {
        console.log(err);
      }
    };
    getSubjects();
  }, [refresh]);

  return (
    <div className="home">
      {subjects.length > 0 ? (
        <>
          {subjects.map((s) => (
            <SubjectCard
              key={s.id}
              refresh={refresh}
              setRefresh={setRefresh}
              data={s}
              saved={true}
            />
          ))}
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
