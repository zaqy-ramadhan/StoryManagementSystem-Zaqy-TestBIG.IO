import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UpdateChapter = () => {
  const { id: storyId, chapterId } = useParams();
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch chapter data when component mounts for updating
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chapters/${chapterId}`);
        const { title, content } = response.data;
        setChapterTitle(title);
        setChapterContent(content);
      } catch (error) {
        console.log(error);
      }
    };

    if (chapterId) {
      fetchChapter();
    }
  }, [chapterId]);

  const updateChapter = async (e) => {
    e.preventDefault();
    try {
      const chapterData = {
        title: chapterTitle,
        content: chapterContent,
        story: storyId,
      };

      // Update existing chapter
      await axios.patch(`http://localhost:5000/chapters/${chapterId}`, chapterData);

      navigate(`/edit/${storyId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns mt-5">
      <div className="column is-half">
        <h1 className="h1">Edit Chapter</h1>
        <form onSubmit={updateChapter}>
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
                readOnly
                value={chapterContent}
                onChange={(value) => setChapterContent(value)}
                placeholder="Chapter Content"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success" style={{ marginRight: '10px' }}>
                Update Chapter
              </button>
              <Link to={`/edit/${storyId}`} className="button is-light">
                Back to Story
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateChapter;
