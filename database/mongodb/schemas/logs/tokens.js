import mongoose from 'mongoose';
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

export default mongoose.model('tokens', schema);