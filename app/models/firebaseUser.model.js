const mongoose = require('mongoose');

const FirebaseUserSchema = mongoose.Schema({
    email: String,
    firebase_uid: String
}, {
    timestamps: true
});

module.exports = mongoose.model('FirebaseUser', FirebaseUserSchema);