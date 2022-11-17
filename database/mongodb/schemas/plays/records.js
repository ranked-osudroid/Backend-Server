import mongoose from 'mongoose';
import { Utils } from '#utils';
const { Schema } = mongoose;

const schema = new Schema({
    id: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    mapId: {
        type: Number,
        required: true
    },
    mapSetId: {
        type: Number,
        required: true
    },
    mapHash: {
        type: String,
        required: true
    },
    perfectX: {
        type: Number
    },
    perfect: {
        type: Number
    },
    greatX : {
        type: Number
    },
    great: {
        type: Number
    },
    good: {
        type: Number
    },
    miss: {
        type: Number
    },
    score: {
        type: Number
    },
    acc: {
        type: Number
    },
    rank: {
        type: String
    },
    modList: {
        type: Array
    },
    maxCombo: {
        type: Number
    },
    submitTime: {
        type: Number
    },
    createdTime: {
        type: Number,
        default: () => Utils.getUnixTime()
    },
    played: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('records', schema);