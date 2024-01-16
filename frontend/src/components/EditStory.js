import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import $ from "jquery";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-bs4";
import { format } from 'date-fns';

const EditStory = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setcoverImage] = useState(null);
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [newCoverImage, setNewCoverImage] = useState(null)

  const [chapters, setChapters] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    getStoryById();
    getChapters();
    // Cleanup DataTables when component unmounts
    return () => {
      if ($.fn.dataTable.isDataTable("#chapterTable")) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, []);

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

  const updateStory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("synopsis", synopsis);
      formData.append("category", category);
      formData.append("coverImage", newCoverImage || coverImage);
      formData.append("tags", tags);
      formData.append("status", status);

      await axios.patch(`http://localhost:5000/stories/${id}`, formData);
      alert("Story updated successfully!");
      navigate(`/edit/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

    // Fungsi untuk menangani perubahan pada input gambar
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setNewCoverImage(file);
  
      // Setelah mengunggah gambar baru, Anda juga dapat memperbarui tampilan gambar yang ditampilkan
      const reader = new FileReader();
      reader.onloadend = () => {
        setcoverImage(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    };

  const getChapters = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/stories/${id}/chapters`);
      setChapters(response.data);

    if ($.fn.dataTable.isDataTable("#chapterTable")) {
      $(tableRef.current).DataTable().destroy();
    }

    $(tableRef.current).DataTable();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChapters = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this chapter?");
      if(confirmDelete){
        await axios.delete(`http://localhost:5000/chapters/${id}`);
        if ($.fn.dataTable.isDataTable("#chapterTable")) {
          $(tableRef.current).DataTable().destroy();
        }
        getChapters();
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <><div className="columns mt-5">
      <div className="column is-half">
      <h1 className="mb-4" >Story Edit</h1>
        <form onSubmit={updateStory}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                required
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title" />
            </div>
          </div>
          <div className="field">
            <label className="label">Author</label>
            <div className="control">
              <input
                required
                type="text"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author" />
            </div>
          </div>
          <div className="field">
            <label className="label">Synopsis</label>
            <div className="control">
              <textarea
                required
                className="form-control"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Synopsis" />
            </div>
          </div>
          <div className="field">
            <label className="label">Category</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Financial">Financial</option>
                  <option value="Technology">Technology</option>
                  <option value="Health">Health</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Tags</label>
            <div className="control">
              <input
                required
                type="text"
                className="form-control"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (separate with commas)" />
            </div>
          </div>
          <div className="field">
            <label className="label">Status</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Publish">Publish</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <img
              src={newCoverImage ? coverImage : `http://localhost:5000/${coverImage}`}
              alt={`New Image Uploaded ${title}`}
              style={{ width: "auto", height: "200px" }}
            />
          </div>
          <div className="field">
            <label className="label">Story Cover</label>
            <div className="control">
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success" style={{ marginRight: '10px' }}>
                Update
              </button>
              <Link to={`/`} className="button is-light">
                Back to dashboard
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
    
    <div>
        <div>
          <Link to={`/${id}/addChapter`} className="button is-success">
            Add New Chapter
          </Link>
          <table
            id="chapterTable"
            ref={tableRef}
            className="table is-striped is-fullwidth mt-2"
          >
            <thead>
              <tr>
                <th>No</th>
                <th>Title</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter, index) => (
                <tr key={chapter._id}>
                  <td>{index + 1}</td>
                  <td>{chapter.title}</td>
                  <td>{format(new Date(chapter.updatedAt), 'dd MMMM yyyy')}</td>
                  <td>
                    <Link
                      to={`update/${chapter._id}`}
                      className="btn btn-primary me-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteChapters(chapter._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div></>
  );
};

export default EditStory;
