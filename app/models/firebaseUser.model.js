const mongoose = require('mongoose');

const FirebaseUserSchema = mongoose.Schema({
    email: String,
    complete_name: String,
    firebase_uid: String,
    _id: String
}, {
    timestamps: true
});

module.exports = mongoose.model('FirebaseUser', FirebaseUserSchema);