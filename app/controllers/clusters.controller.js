const Clusters = require('../models/clusters.model.js');
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
    Clusters.findOne({},{}, { sort : { 'created_at' : -1}}, function (err, post) {
        var clusters = new Array(post.clustersgroups);
        console.log(clusters);
        clusters[0].forEach(function (cluster) {{
            console.log(cluster);
            clusteruids = new Array(cluster.uids);
            console.log(clusteruids)
            clusteruids[0].forEach(function (uidcluster) {
                if(uidcluster == uid) {
                    res.send(clusteruids[0]);
                }
            });
        }});
    });
};