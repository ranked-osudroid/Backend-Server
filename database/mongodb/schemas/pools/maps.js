const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    mapId: {
        type: Number,
        required: true
    },
    mapSetId: {
        type: Number,
        required: true
    },
    mods: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    starRating: {
        type: Number,
        required: true
    },
    bpm: {
        type: Number,
        required: true
    },
    maxCombo: {
        type: Number,
        required: true
    },
    sheetId: {
        type: Number,
        required: true
    },
    mapName: {
        type: String,
        required: true
    },
    difficultyName: {
        type: String,
        required: true
    }
});

export const Maps = mongoose.model('maps', schema);