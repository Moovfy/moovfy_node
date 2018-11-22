const Relation = require('../models/relation.model.js');

exports.create = (req, res) => {
    const relation = new Relation({
        firebase_uid1: req.body.firebase_uid1,
        firebase_uid2: req.body.firebase_uid2,
        status: req.body.status
    });

    // Save Relation in the database
    relation.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the relation"
        });
    });
};

exports.findAll = (req, res) => {
    Relation.find()
        .then(relations => {
            res.send(relations);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving relations."
        });
    });
};

exports.findByUID = (req, res) => {
    Relation.find({
        $or: [{firebase_uid1: req.params.userUID}, {firebase_uid2: req.params.userUID}]},
            function (err, relations) {
                if (!relations) {
                    return res.status(404).send({
                        message: "Relations not found with id " + req.params.userUID
                    });
                }
                res.send(relations);
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
};

exports.blocked = (req,res) => {
    var uid = req.params.userUID;
    getBlocked(uid, function (result) {
        res.send(result);
    })
}


exports.block = (req, res) => {
    var query = { "firebase_uid1": req.body.firebase_uid1, "firebase_uid2": req.body.firebase_uid2},
        update = { "$set": { "status": "blocked"} },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

// Find the document
    Relation.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) res.status(500).send("Error");
        else res.send(result);
        // do something with the document
    });
};

exports.unblock = (req, res) => {
    Relation.findOneAndUpdate({ "firebase_uid1": req.body.firebase_uid1, "firebase_uid2": req.body.firebase_uid2 }, { "$set": { "status": "ok"}}).exec(function(err, relation){
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send("Unblocked!");
        }
    });
};

// Delete a Relation with the specified LocationId in the request
exports.delete = (req, res) => {
    Relation.findOneAndDelete({ "firebase_uid1": req.body.firebase_uid1, "firebase_uid2": req.body.firebase_uid2 }).exec(function(err, relation){
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send("Deleted!!");
        }
    });
};

async function getBlocked(uid,callback) {
    var response = [];
    Relation.find({
            $or: [{firebase_uid1: uid}, {firebase_uid2: uid}]},
        async function (err, relations) {
            if (!relations) {
               callback();
            }
            var resp = [];
            for (let i = 0; i < relations.length; i++) {
                await new Promise(resolve => {
                    var relation = relations[i];
                    if(relation["status"] == blocked) {
                        resp.push(relation);
                    }
                    resolve();
                });
            }
            callback(relations);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            callback()
        }
        });
};