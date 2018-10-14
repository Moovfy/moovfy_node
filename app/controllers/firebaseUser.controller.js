const FirebaseUser = require('../models/firebaseUser.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    /*if(!req.body.content) {
        return res.status(400).send({
            message: "Firebase User content can not be empty"
        });
    }*/

    console.log(req.body.complete_name);
    // Create a firebaseUser
    const firebaseUser = new FirebaseUser({
        email: req.body.email,
        complete_name: req.body.complete_name,
        firebase_uid: req.body.firebase_uid,
        _id: req.body.firebase_uid
    });

    // Save Note in the database
    firebaseUser.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Firebase User."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    FirebaseUser.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Firebase Users."
        });
    });
};

// Find a single note with a noteId
exports.findByUID = (req, res) => {
    console.log("A findbyUID");
    FirebaseUser.findOne({ firebase_uid : req.params.userUID} )
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    //message: "User not found with id " + req.params.userUID,
                    message: "Print " + FirebaseUser.findOne({ firebase_uid : req.params.userUID })
                });
            }
            res.send(user);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with firebase useruid " + req.params.userUID
            });
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userUID
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find note and update it with the request body
    FirebaseUser.findByIdAndUpdate(req.params.userUID, {
        email: req.body.email || "Unemailed user"
    }, {new: true})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userUID
                });
            }
            res.send(user);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userUID
            });
        }
        return res.status(500).send({
            message: "Error updating User with id " + req.params.userUID
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    FirebaseUser.findByIdAndRemove(req.params.userUID)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userUID
                });
            }
            res.send({message: "User deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userUID
            });
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.params.userUID
        });
    });
};

exports.findByName = (req,res) => {
    var data = req.params.searchname;
    FirebaseUser.find({'complete_name' : new RegExp(data, 'i')}, function(err, users){
        res.send(users)
    });
};