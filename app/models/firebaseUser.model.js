const mongoose = require('mongoose');
var LocationUser = new mongoose.Schema({ latitude: Number,
                                longitude: Number});

const FirebaseUserSchema = mongoose.Schema({
    email: String,
    complete_name: String,
    username: String,
    firebase_uid: String,
    locations : [LocationUser],
    avatar: String,
    _id: String
}, {
    timestamps: true
});

module.exports = mongoose.model('FirebaseUser', FirebaseUserSchema);