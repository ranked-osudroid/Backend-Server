const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    time: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    body: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('errors', schema);