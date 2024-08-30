const express = require('express');
const protect = require('../middleware/authMiddleware');
const Project = require('../models/Project');
const Bug = require('../models/Bug');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (Admin only)
// @access  Private
router.get('/', protect, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const projects = await Project.find().populate('developers', 'username email');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/projects
// @desc    Create a new project (Admin only)
// @access  Private
router.post('/', protect, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { project_name, developers, start_date, deadline, technologies_used, status } = req.body;

    try {
        const project = new Project({
            project_name,
            developers: developers.split(',').map(dev => dev.trim()), // assuming developers are passed as comma-separated user IDs
            start_date,
            deadline,
            technologies_used,
            status
        });

        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/projects/developer
// @desc    Get projects assigned to the logged-in developer
// @access  Private
router.get('/developer', protect, async (req, res) => {
    if (req.user.role !== 'developer') return res.status(403).json({ message: 'Access denied' });

    try {
        const projects = await Project.find({ developers: req.user.id }).populate('developers', 'username email');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/projects/:id
// @desc    Get project details including associated bugs
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('developers', 'username email');
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const bugs = await Bug.find({ project_id: req.params.id }).populate('created_by', 'username email');
        res.json({ project, bugs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/projects/:id/bugs
// @desc    Add a new bug to the project
// @access  Private
router.post('/:id/bugs', protect, async (req, res) => {
    const { title, content } = req.body;

    try {
        const bug = new Bug({
            title,
            content,
            created_by: req.user.id,
            project_id: req.params.id
        });

        await bug.save();
        res.status(201).json(bug);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
