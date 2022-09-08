import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    ip: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    body: {
        type: Object,
        required: true
    },
    time: {
        type: Number,
        required: true
    }
});

export default mongoose.model('404s', schema);