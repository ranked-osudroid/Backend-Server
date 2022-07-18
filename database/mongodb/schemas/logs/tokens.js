const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    createdTime: {
        type: Number,
        required: true
    },
    tokens: {
        type: Array,
        required: true
    }
});

export const Tokens = mongoose.model('tokens', schema);