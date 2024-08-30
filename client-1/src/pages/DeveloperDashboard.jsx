// src/pages/DeveloperDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DeveloperDashboard() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await axios.get('http://localhost:5000/api/projects/developer', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProjects(res.data);
        };
        fetchProjects();
    }, []);

    return (
        <div>
            <h2>Developer Dashboard</h2>
            <h3>Assigned Projects</h3>
            <ul>
                {projects.map(project => (
                    <li key={project._id} onClick={() => navigate(`/projects/${project._id}`)}>
                        {project.project_name} - {project.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DeveloperDashboard;
