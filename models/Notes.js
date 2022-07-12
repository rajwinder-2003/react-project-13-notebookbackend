const mongoose = require('mongoose');
//this is notes schema structer or model
const NotesSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    subtitle:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: String,
        default: Date.now
    },
});
const Notes = mongoose.model('notes',NotesSchema);
module.exports = Notes;