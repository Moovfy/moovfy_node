const mongoose = require('mongoose');

const RelationSchema = mongoose.Schema({
    firebase_uid1: String,
    firebase_uid2: String,
    status: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Relation', RelationSchema);