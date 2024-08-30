const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    project_name: { type: String, required: true },
    developers: [{ type: String, required: true }],
    start_date: { type: Date, required: true },
    deadline: { type: Date, required: true },
    technologies_used: { type: String, required: true },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' }
});

module.exports = mongoose.model('Project', ProjectSchema);
