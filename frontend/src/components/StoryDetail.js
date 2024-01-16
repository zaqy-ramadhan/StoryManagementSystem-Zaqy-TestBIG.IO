import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-bs4";
import { format } from 'date-fns';
import $ from "jquery";

const ViewStory = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setcoverImage] = useState(null);
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState(true);
  const { id } = useParams();

  const [chapters, setChapters] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    getStoryById();
  });

  const getStoryById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/stories/${id}`);
      const { title, author, synopsis, category, tags, status, coverImage } = response.data;
      setTitle(title);
      setAuthor(author);
      setSynopsis(synopsis);
      setCategory(category);
      setcoverImage(coverImage);
      setTags(tags.join(", "));
      setStatus(status);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="columns mt-5">
        <div className="column is-half">
          <h1 className="mb-4 h1">Story Detail</h1>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <p>{title}</p>
            </div>
          </div>
          <div className="field">
            <label className="label">Author</label>
            <div className="control">
              <p>{author}</p>
            </div>
          </div>
          <div className="field">
            <label className="label">Synopsis</label>
            <div className="control">
              <p>{synopsis}</p>
            </div>
          </div>
          <div className="field">
            <label className="label">Category</label>
            <div className="control">
              <p>{category}</p>
            </div>
          </div>
          <div className="field">
            <label className="label">Tags</label>
            <div className="control">
              <p>{tags}</p>
            </div>
          </div>
          <div className="field">
            <label className="label">Status</label>
            <div className="control">
              <p>{status ? "Publish" : "Draft"}</p>
            </div>
          </div>
          <div className="field">
            <img
              src={`http://localhost:5000/${coverImage}`}
              alt={`Story Cover ${title}`}
              style={{ width: "auto", height: "200px" }}
            />
          </div>
          <div className="field mt-2">
            <Link to={`/`} className="btn btn-primary">
                Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStory;
