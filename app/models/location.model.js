const mongoose = require('mongoose');
const FirebaseUser = require('../models/firebaseUser.model.js');

const LocationSchema = mongoose.Schema({
    latitude: Number,
    longitude: Number,
    firebase_uid: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Location', LocationSchema);