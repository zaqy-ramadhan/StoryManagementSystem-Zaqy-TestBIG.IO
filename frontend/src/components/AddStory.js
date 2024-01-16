import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AddStory = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [category, setCategory] = useState("Financial");
  const [storyCover, setcoverImage] = useState(null);
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Publish");
  const navigate = useNavigate();

  const saveStory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);  
      formData.append("synopsis", synopsis);
      formData.append("category", category);
      formData.append("coverImage", storyCover);
      formData.append("tags", tags);
      formData.append("status", status || "publish");

      // await axios.post("http://localhost:5000/stories", formData);
      // navigate(`/`);
      // Kirim data ke server
      const response = await axios.post("http://localhost:5000/stories", formData);

      // Jika penyimpanan berhasil, arahkan ke halaman edit dengan ID yang baru saja dibuat
      if (response.data && response.data._id) {
        const newStoryId = response.data._id;
        navigate(`/edit/${newStoryId}`);
      } else {
        // Jika tidak ada ID yang dikembalikan, tangani sesuai kebutuhan aplikasi Anda
        console.log("Gagal mendapatkan ID setelah menyimpan data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns mt-5">
      <div className="column is-half">
      <h1 className="mb-4">Add Story</h1>
        <form onSubmit={saveStory}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Author</label>
            <div className="control">
              <input
                type="text"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Synopsis</label>
            <div className="control">
              <textarea
                className="form-control"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Synopsis"
                required
              />
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
              type="text"
              className="form-control"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (separate with commas)"
              required
            />
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
            <label className="label">Story Cover</label>
            <div className="control">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setcoverImage(e.target.files[0])}
                accept="image/*"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success" style={{ marginRight: '10px' }}>
                Save
              </button>
              <Link to={`/`} className="button is-light">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStory;
