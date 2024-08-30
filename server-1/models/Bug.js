const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['Opened', 'Resolved', 'Working'], default: 'Opened' },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});

module.exports = mongoose.model('Bug', BugSchema);
