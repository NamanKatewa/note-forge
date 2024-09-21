import axios from "axios";
import { useParams } from "react-router-dom";
import { apiRoute } from "../utils";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import "./Search.scss";
import { useQuery } from "@tanstack/react-query";

const fetchResults = async (query) => {
  const res = await axios.post(`${apiRoute}/search/`, { query });
  return res.data;
};

const Search = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["results", query],
    queryFn: () => fetchResults(query),
    enabled: !!query,
  });

  if (isLoading) return <Loader />;

  const noResults =
    data.subjects.length === 0 &&
    data.assignments.length === 0 &&
    data.solutions.length === 0 &&
    data.notes.length === 0 &&
    data.exams.length === 0 &&
    data.papers.length === 0 &&
    data.resources.length === 0 &&
    data.books.length === 0;

  return (
    <div className="searchResult">
      {noResults && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ccffff",
          }}
        >
          No result for {query}
        </div>
      )}
      {!noResults && data.subjects.length > 0 && (
        <div className="grid subjects">
          <h1>Subjects</h1>
          <div className="searchList">
            {data.subjects.map((s) => (
              <div
                className="card"
                key={s.id}
                onClick={() => navigate(`/subjects/${s.id}/${s.name}`)}
              >
                {s.name}
              </div>
            ))}
          </div>
        </div>
      )}
      {!noResults && data.assignments.length > 0 && (
        <div className="grid assignments">
          <h1>Assignments</h1>
          <div className="searchList">
            {data.assignments.map((a) => (
              <div
                className="card"
                key={a.id}
                onClick={() => navigate(`/assignments/${a.id}`)}
              >
                {a.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {!noResults && data.solutions.length > 0 && (
        <div className="grid solutions">
          <h1>Solutions</h1>
          <div className="searchList">
            {data.solutions.map((s) => (
              <div
                className="card"
                key={s.id}
                onClick={() => window.open(s.link, "_blank")}
              >
                {s.content}
              </div>
            ))}
          </div>
        </div>
      )}
      {!noResults && data.notes.length > 0 && (
        <div className="grid notes">
          <h1>Notes</h1>
          <div className="searchList">
            {data.notes.map((n) => (
              <div
                className="card"
                key={n.id}
                onClick={() => window.open(n.link, "_blank")}
              >
                {n.title}
                <br />
                {n.content}
              </div>
            ))}
          </div>
        </div>
      )}
      {!noResults && data.exams.length > 0 && (
        <div className="grid exams">
          <h1>Exams</h1>
          <div className="searchList">
            {data.exams.map((e) => (
              <div
                className="card"
                key={e.id}
                onClick={() => navigate(`/exams/${e.id}`)}
              >
                {e.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {!noResults && data.papers.length > 0 && (
        <div className="grid papers">
          <h1>Papers</h1>
          <div className="searchList">
            {data.papers.map((e) => (
              <div
                className="card"
                key={e.id}
                onClick={() => window.open(e.link, "_blank")}
              >
                {e.title}
                <br />
                {e.exam.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {!noResults && data.resources.length > 0 && (
        <div className="grid resources">
          <h1>Resources</h1>
          <div className="searchList">
            {data.resources.map((e) => (
              <div
                className="card"
                key={e.id}
                onClick={() => window.open(e.link, "_blank")}
              >
                {e.title}
                <br />
                {e.content}
              </div>
            ))}
          </div>
        </div>
      )}
      {!noResults && data.books.length > 0 && (
        <div className="grid books">
          <h1>Books</h1>
          <div className="searchList">
            {data.books.map((e) => (
              <div
                className="card"
                key={e.id}
                onClick={() => window.open(e.link, "_blank")}
              >
                <img src={e.imgUrl} alt="" />
                {e.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
