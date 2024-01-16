import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import $ from "jquery";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-bs4";
import 'bootstrap/dist/css/bootstrap.min.css';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const tableRef = useRef();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getStories();
    // Cleanup DataTables when component unmounts
    return () => {
      if ($.fn.dataTable.isDataTable("#storyTable")) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [categoryFilter, statusFilter]);

  const getStories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stories",  {
        params: {
          category: categoryFilter,
          status: statusFilter,
        },
      });
      setStories(response.data);

      // Initialize DataTables
      if ($.fn.dataTable.isDataTable("#storyTable")) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStory = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this story?");
      if(confirmDelete){
        await axios.delete(`http://localhost:5000/stories/${id}`);
        if ($.fn.dataTable.isDataTable("#storyTable")) {
          $(tableRef.current).DataTable().destroy();
        }
        getStories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="container">
        <div className="field" style={{marginBottom: '50px'}}>
          <div className="row">
            <h1>Story List</h1>
            <Link to="add" className="col-md-1 button is-success" style={{marginTop:'23px', marginRight: '10px'}}>
              Add New
            </Link>
            <div className="col-md-2" style={{marginRight:'10px'}}>
              <label>Category Filter:</label>
              <select className="form-control"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                <option value="Health">Health</option>
                <option value="Financial">Financial</option>
                <option value="Technology">Technology</option>
              </select>
            </div>

            <div className="col-md-2">
              <label>Status Filter:</label>
              <select className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">-- Select Status --</option>
                <option value="Draft">Draft</option>
                <option value="Publish">Publish</option>
              </select>
            </div>
          </div>
        </div>
        <table
          id="storyTable"
          ref={tableRef}
          className="table is-striped is-fullwidth mt-2"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story, index) => (
              <tr key={story._id}>
                <td>{index + 1}</td>
                <td>{story.title}</td>
                <td>{story.author}</td>
                <td>{story.category}</td>
                <td>{story.tags.join(", ")}</td>
                <td>{story.status}</td>
                <td>
                  {story.coverImage && (
                    <img
                      src={`http://localhost:5000/${encodeURIComponent(story.coverImage)}`}
                      alt={story.title}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                </td>
                <td>
                  <Link
                    to={`edit/${story._id}`}
                    className="btn btn-primary me-1"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteStory(story._id)}
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
    </div>
  );
};

export default StoryList;
