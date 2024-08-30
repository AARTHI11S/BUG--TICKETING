// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'developer',  // default role set to 'developer'
    });
    const [loading, setLoading] = useState(false); // Loading state for registration
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert('Registration successful! You can now log in.');
            navigate('/');
        } catch (err) {
            console.error(err.response?.data?.error);
            alert('Error during registration. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="text-center">Register</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <input 
                                        type="text" 
                                        name="username" 
                                        className="form-control"
                                        value={formData.username} 
                                        onChange={handleInputChange} 
                                        placeholder="Username" 
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className="form-control"
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        placeholder="Email" 
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="password" 
                                        name="password" 
                                        className="form-control"
                                        value={formData.password} 
                                        onChange={handleInputChange} 
                                        placeholder="Password" 
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <select 
                                        name="role" 
                                        className="form-control" 
                                        value={formData.role} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="developer">Developer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        'Register'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
