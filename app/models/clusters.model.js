const mongoose = require('mongoose');

const ClustersSchema = mongoose.Schema({
    clustersgroups: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('Clusters', ClustersSchema);
