import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRoute } from "../utils";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Search = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { query } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getResults = async () => {
      const res = await axios.post(`${apiRoute}/search/`, { query });
      setData(res.data);
      setIsLoading(false);
    };
    getResults();
  }, [query]);

  return (
    <div className="searchResult">
      {isLoading && <Loader />}
      {!isLoading &&
        data.subjects.length === 0 &&
        data.assignments.length === 0 &&
        data.solutions.length === 0 &&
        data.notes.length === 0 &&
        data.exams.length === 0 &&
        data.papers.length === 0 &&
        data.resources.length === 0 &&
        data.books.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No result for {query}
          </div>
        )}
      {!isLoading && data.subjects.length > 0 && (
        <>
          <h1>Subjects</h1>
          <div className="searchList">
            {data.subjects.map((s) => (
              <div
                className="searchItem"
                key={s.id}
                onClick={() => navigate(`/subjects/${s.id}/${s.name}`)}
              >
                {s.name}
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoading && data.assignments.length > 0 && (
        <>
          <h1>Assignments</h1>
          <div className="searchList">
            {data.assignments.map((a) => (
              <div
                className="searchItem"
                key={a.id}
                onClick={() => navigate(`/assignments/${a.id}`)}
              >
                {a.title}
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoading && data.solutions.length > 0 && (
        <>
          <h1>Solutions</h1>
          <div className="searchList">
            {data.solutions.map((s) => (
              <div
                className="searchItem"
                key={s.id}
                onClick={() => window.open(s.link, "_blank")}
              >
                {s.content}
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoading && data.notes.length > 0 && (
        <>
          <h1>Notes</h1>
          <div className="searchList">
            {data.notes.map((n) => (
              <div
                className="searchItem"
                key={n.id}
                onClick={() => window.open(n.link, "_blank")}
              >
                {n.title}
                <br />
                {n.content}
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoading && data.exams.length > 0 && (
        <>
          <h1>Exams</h1>
          <div className="searchList">
            {data.exams.map((e) => (
              <div
                className="searchItem"
                key={e.id}
                onClick={() => navigate(`/exams/${e.id}`)}
              >
                {e.title}
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoading && data.papers.length > 0 && (
        <>
          <h1>Papers</h1>
          <div className="searchList">
            {data.papers.map((e) => (
              <div
                className="searchItem"
                key={e.id}
                onClick={() => window.open(e.link, "_blank")}
              >
                {e.title}
                <br />
                {e.exam.title}
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoading && data.resources.length > 0 && (
        <>
          <h1>Resources</h1>
          <div className="searchList">
            {data.resources.map((e) => (
              <div
                className="searchItem"
                key={e.id}
                onClick={() => window.open(e.link, "_blank")}
              >
                {e.title}
                <br />
                {e.content}
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoading && data.books.length > 0 && (
        <>
          <h1>Books</h1>
          <div className="searchList">
            {data.books.map((e) => (
              <div
                className="searchItem"
                key={e.id}
                onClick={() => window.open(e.link, "_blank")}
              >
                <img src={e.imgUrl} alt="" />
                {e.title}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
