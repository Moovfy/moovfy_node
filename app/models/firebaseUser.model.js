const mongoose = require('mongoose');

const FirebaseUserSchema = mongoose.Schema({
    email: String,
    firebase_uid: String,
    _id: String
}, {
    timestamps: true
}, {
    _id: false });

module.exports = mongoose.model('FirebaseUser', FirebaseUserSchema);