const Clusters = require('../models/clusters.model.js');
const ClusterGroup = require('../models/clusterGroup.model.js');
const Cluster = require('../models/cluster.model.js');

exports.create = (req, res) => {

    var arraytemp = req.body.cluster;
    var clusters = new Clusters();

    arraytemp.forEach(function(clustergroup) {
        var cluster = new Cluster();
        clustergroup.forEach(function (uid) {
            cluster.uids.push(uid);
        });
        clusters.clustersgroups.push(cluster);
    });

    // Save Relation in the database
    clusters.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the cluster"
        });
    });
};

exports.findAll = (req, res) => {
    Clusters.find()
        .then(clusters => {
            res.send(clusters);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving clusters."
        });
    });
};

exports.findByUID = (req, res) => {
    var uid = req.params.userUID;
    Clusters.find().then(allClusters => {
        allClusters.forEach(function (cluster) {
            Array.from(cluster.children).forEach(function (subcluster) {
                //IN INNER ARRAY
                subcluster.forEach(function (id) {
                    //ELEMENT
                    if(uid == id) {
                        res.send(subcluster);
                    }
                });
            });
        });
    });
    res.status(500).send("No founded in any cluster");
};