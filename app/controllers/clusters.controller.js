const Clusters = require('../models/clusters.model.js');
const Cluster = require('../models/cluster.model.js');
const Relation = require('../models/relation.model.js');

var response  = [];

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
    getData(uid,function(resp) {
       res.send(resp);
    });
};

function getData(uid,callback) {
    Clusters.findOne().sort('-createdAt').exec(function (err,post){
        var clusters = new Array(post.clustersgroups);
        console.log(clusters);
        var found = false;
        clusters[0].forEach(function (cluster) {{
            console.log(cluster);
            clusteruids = new Array(cluster.uids);
            console.log(clusteruids[0]);
            if(clusteruids[0].includes(uid)) {
                found = true;
                clusteruids[0].forEach(function (uids) {
                    if(uids != uid) {
                        getRelation(uid,uids,function(relation) {
                            response.push({
                                "uid" : uids,
                                "relation" : relation
                            });
                            res.send(response);
                        });
                    }
                });
                res.send(response);
            }
        }});
        if(!found) {
            res.send([])
        }
    });
}

function getRelation(uid1,uid2,callback) {
    Relation.find({
            $or: [
                { $and: [ {firebase_uid1: uid1}, {firebase_uid2: uid2} ] },
                { $and: [ {firebase_uid1: uid2}, {firebase_uid2: uid1} ] }
                ]},
        function (err, relation) {
            if (!relation) {
                callback("")
            }
            callback(relation.status);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Relations not found with id " + req.params.userUID
            });
        }
        return res.status(500).send({
            message: "Error retrieving Relations with id " + req.params.userUID
        });
    })
}