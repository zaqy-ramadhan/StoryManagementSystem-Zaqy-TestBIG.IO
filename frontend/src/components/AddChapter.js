import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddChapter = () => {
  const storyId = useParams();
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const navigate = useNavigate();

  const saveChapter = async (e) => {
    e.preventDefault();
    try {
      const chapterData = {
        title: chapterTitle,
        content: chapterContent,
        story: storyId.id,
      };
      console.log(chapterData);

      await axios.post("http://localhost:5000/chapters", chapterData);
      navigate(`/edit/${storyId.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns mt-5">
      <div className="column is-half">
      <h1>Add Chapter</h1>
        <form onSubmit={saveChapter}>
          <div className="field">
            <label className="label">Chapter Title</label>
            <div className="control">
              <input
                required
                type="text"
                className="input"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Chapter Title"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Chapter Content</label>
            <div className="control">
              <ReactQuill
                required
                value={chapterContent}
                onChange={(value) => setChapterContent(value)}
                placeholder="Chapter Content"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success" style={{ marginRight: '10px' }}>
                Save Chapter
              </button>
              <Link to={`/edit/${storyId.id}`} className="button is-light">
                Back to Story
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChapter;
