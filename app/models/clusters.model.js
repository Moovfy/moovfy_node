const mongoose = require('mongoose');
//const ClusterGroup = require('../models/clusterGroup.model.js');

const ClustersSchema = mongoose.Schema({
    clustersgroups: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('Clusters', ClustersSchema);
