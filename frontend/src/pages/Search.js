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

  const getResults = async () => {
    const res = await axios.post(`${apiRoute}/search/`, { query });
    setData(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getResults();
  }, [data]);

  return (
    <div className="searchResult">
      {isLoading && <Loader />}
      {!isLoading &&
        data.subjects.length === 0 &&
        data.assignments.length === 0 &&
        data.solutions.length === 0 && (
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
                onClick={() => (window.location.href = s.link)}
              >
                {s.content}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
