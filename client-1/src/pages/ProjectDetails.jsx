// src/pages/ProjectDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate()
  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [newBug, setNewBug] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [addingBug, setAddingBug] = useState(false); // Loading state for adding a new bug

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProject(res.data.project);
        setBugs(res.data.bugs);
      } catch (err) {
        console.error(err.response?.data?.error);
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchProjectDetails();
  }, [id]);

  const handleAddBug = async () => {
    setAddingBug(true); // Start adding bug loading
    try {
      await axios.post(`http://localhost:5000/api/projects/${id}/bugs`, newBug, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewBug({ title: '', content: '' }); // Reset form
      window.location.reload();
    } catch (err) {
      console.error(err.response?.data?.error);
    } finally {
      setAddingBug(false); // End adding bug loading
    }
  };

  const handleInputChange = (e) => {
    setNewBug({ ...newBug, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Redirect the user to login, if not a valid user
  useEffect(() => {
    if (localStorage.getItem('token')) return
    navigate('/')
  }, [])

  return (
    <div className="container mt-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>
        <span className='fs-6 mx-2' style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>&lt; Go Back</span>
        Project Details
      </h2>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className='row'>
          {project && (
            <div className="card mb-4 col-md-4">
              <div className="card-header">
                <h3>{project.project_name}</h3>
              </div>
              <div className="card-body">
                <p><strong>Status:</strong> {project.status}</p>
                <p><strong>Technologies Used:</strong> {project.technologies_used}</p>
                <p><strong>Deadline:</strong> {project.deadline}</p>
              </div>
            </div>
          )}

          <div className="card mb-4 col-md-4" style={{ height: '350px' }}>
            <div className="card-header">
              <h3>Bugs</h3>
            </div>
            <div className="card-body overflow-scroll">
              <ul className="list-group">
                {bugs.map((bug) => (
                  <li key={bug._id} className="list-group-item d-flex justify-content-between align-items-center">
                    {bug.title} - {bug.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card col-md-4">
            <div className="card-header">
              <h3>Add a New Bug</h3>
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Bug Title"
                  value={newBug.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group mb-3">
                <textarea
                  className="form-control"
                  name="content"
                  placeholder="Bug Content"
                  rows="4"
                  value={newBug.content}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleAddBug}
                disabled={addingBug}
              >
                {addingBug ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Add Bug'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
