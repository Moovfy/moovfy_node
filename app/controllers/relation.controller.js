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
    Relation.find({ firebase_uid1: req.params.userUID })
        .then(relations => {
            if(!relations) {
                return res.status(404).send({
                    message: "Relations not found with id " + req.params.userUID
                });
            }
            res.send(relations);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Relations not found with id " + req.params.userUID
            });
        }
        return res.status(500).send({
            message: "Error retrieving Relations with id " + req.params.userUID
        });
    });
};

exports.block = (req, res) => {
    Relation.findOneAndUpdate({ "firebase_uid1": req.body.firebase_uid1, "firebase_uid2": req.body.firebase_uid2 }, { "$set": { "status": "blocked"}}).exec(function(err, relation){
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send("Blocked!");
        }
    });
};

exports.unblock = (req, res) => {
    Relation.findOneAndUpdate({ "firebase_uid1": req.body.firebase_uid1, "firebase_uid2": req.body.firebase_uid2 }, { "$set": { "ok": "blocked"}}).exec(function(err, relation){
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