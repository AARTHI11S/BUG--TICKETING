// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    project_name: '',
    developers: '',
    start_date: '',
    deadline: '',
    technologies_used: '',
    status: '',
  });
  const [loading, setLoading] = useState(false); // State to manage loading
  const [creating, setCreating] = useState(false); // State to manage project creation loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error(err.response?.data?.error);
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    setCreating(true); // Start creating project loading
    try {
      const response = await axios.post('http://localhost:5000/api/projects', newProject, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Project created successfully!');
      setProjects([...projects, response.data]); // Update projects list with the new project
      setNewProject({
        project_name: '',
        developers: '',
        start_date: '',
        deadline: '',
        technologies_used: '',
        status: '',
      }); // Reset form
    } catch (err) {
      console.error(err.response?.data?.error);
    } finally {
      setCreating(false); // End creating project loading
    }
  };

  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Helper function to get badge class based on status
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Not Started':
        return 'bg-primary'; // Blue for not started
      case 'In Progress':
        return 'bg-warning text-dark'; // Yellow for in progress
      case 'Completed':
        return 'bg-success'; // Green for completed
      default:
        return 'bg-secondary'; // Grey for any other status
    }
  };

  // Redirect the user to login, if not a valid user
  useEffect(() => {
    if (localStorage.getItem('role') === 'admin') return
    navigate('/developer')
    if (localStorage.getItem('token')) return
    navigate('/')
  }, [])

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
        <div className="row">
      <div className="card mb-4 col-md-6">
        <div className="card-header">
          <h3>Create New Project</h3>
        </div>
        <div className="card-body">
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="project_name"
              placeholder="Project Name"
              value={newProject.project_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="developers"
              placeholder="Developers (comma separated)"
              value={newProject.developers}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="date"
              className="form-control"
              name="start_date"
              value={newProject.start_date}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="date"
              className="form-control"
              name="deadline"
              value={newProject.deadline}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="technologies_used"
              placeholder="Technologies Used"
              value={newProject.technologies_used}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <select
              className="form-control"
              name="status"
              value={newProject.status}
              onChange={handleInputChange}
            >
              <option value="">Select Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={handleCreateProject}
            disabled={creating}
          >
            {creating ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </div>

      <div className="card col-md-6">
  <div className="card-header">
    <h3>Existing Projects</h3>
  </div>
  <div className="card-body">
    {loading ? (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : (
      <ul className="list-group">
        {projects.map((project) => (
          <li
            key={project._id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => navigate(`/projects/${project._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <span>
              {project.project_name}
            </span>
            <span className={`badge ${getBadgeClass(project.status)}`}>
              {project.status}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

      </div>
    </div>
  );
}

export default AdminDashboard;
