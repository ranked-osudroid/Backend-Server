import mongoose from 'mongoose';
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
    },
    stack: {
        type: String
    }
});

export default mongoose.model('errors', schema);