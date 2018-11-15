const mongoose = require('mongoose');

var Cluster = new mongoose.Schema({uids: [String]});

module.exports = mongoose.model('Cluster', Cluster);
