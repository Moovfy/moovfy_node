const Clusters = require('../models/clusters.model.js');
const Cluster = require('../models/cluster.model.js');
const Relation = require('../models/relation.model.js');
const FirebaseUser = require('../models/firebaseUser.model.js');
var clustering = require("density-clustering");
var geocluster = require("geocluster");

var response  = [];

exports.create = (req, res) => {

    var arraytemp = req.body.clusters;

    saveCluster(arraytemp,function (result) {
        res.send(result);
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

exports.optics = (req,res) => {
    var result;
    getLastsLocations(function (x) {
        var coordinates = [];
        var keys = Object.keys(x),
            len = keys.length,
            i = 0,
            id,
            last,
            results = new Object();
        while (i < len) {
            id = keys[i];
            var lat = x[id]["latitude"];
            var long = x[id]["longitude"];
            coordinates.push([lat, long]);
            i += 1;
        }
        var optics = new clustering.OPTICS();
        // parameters: 6 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
        var clusters = optics.run(coordinates, 0.005, 2);
        var plot = optics.getReachabilityPlot();
        var result = new Object();
        var clustersresult = new Array();
        clusters.forEach(function (cluster) {
            var clusterarr = new Array();
            cluster.forEach(function (preid) {
                var uid = keys[preid];
                clusterarr.push(uid);
            })
            clustersresult.push(clusterarr);
        });
        result["clusters"] = clustersresult;
        saveCluster(clustersresult,function (call) {
            res.send(call);
        })
    });
};

async function test(){
    for (let i = 0; i < 10; i++) {
        await new Promise(resolve => {
            console.log('Fetch data for ', i)
            getRelation(i,i+1,function (x) {
                console.log(x);
                resolve();
            })
        })
    }
    console.log('Callback')
}
async function getData(uid,callback) {
    response = []
    Clusters.findOne().sort('-createdAt').exec(function (err,post){
        var clusters = new Array(post.clustersgroups);
        var found = false;
        clusters[0].forEach(async function (cluster) {
            console.log(cluster);
            clusteruids = new Array(cluster.uids);
            if(clusteruids[0].includes(uid)) {
                found = true;
                var length = clusteruids[0].length;
                var clusterCopy = [];
                for (let j = 0; j < length; j++) {
                    clusterCopy.push(clusteruids[0][j]);
                }
                for (let i = 0; i < length; i++) {
                    await new Promise(resolve => {
                      console.log('Fetch data for ', i)
                      getRelation(uid,clusterCopy[i],function (relation) {
                          if(uid != clusterCopy[i]) {
                              if (relation[0] == undefined) {
                                  var uids2 = clusterCopy[i]
                                  console.log(uids2)
                                  response.push({
                                      "uid": clusterCopy[i],
                                      "relation": "NO"
                                  });
                              }
                              else {
                                  var uids2 = clusterCopy[i]
                                  console.log(uids2)
                                  response.push({
                                      "uid": clusterCopy[i],
                                      "relation": relation[0].status
                                  });
                              }
                          }
                          console.log('Fetched data for ', i)
                          resolve()
                      })
                    })
                }
                callback(response);
            }
        });
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
                callback("Nula")
            }
            callback(relation);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            callback("Nula");
        }
        else {
            callback("Nula")
        }
    })
}

function getLastsLocations(callback) {
    FirebaseUser.find({}, 'locations', function (err,result) {
        var keys = Object.keys(result),
            len = keys.length,
            i = 0,
            prop,
            last,
            id,
            results = new Object();
        while (i < len) {
            prop = keys[i];
            var array = result[prop]["locations"];
            last = array[array.length - 1];
            id = result[prop]["_id"];
            if(last != undefined) results[id] = last;
            i += 1;
        }
        callback(results);
    });
}

function saveCluster(cluster,callback) {
    var arraytemp = cluster;
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
            callback(clusters);
        }).catch(err => {
            callback(err);
    });
}
