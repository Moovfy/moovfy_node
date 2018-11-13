const mongoose = require('mongoose');

var Cluster = new mongoose.Schema({uids: [Number]});

module.exports = mongoose.model('Cluster', Cluster);
