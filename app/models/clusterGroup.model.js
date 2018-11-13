const mongoose = require('mongoose');

const ClusterGroup = new mongoose.Schema({clusters: {
    type : Array   }});

module.exports = mongoose.model('ClusterGroup', ClusterGroup);
