const FirebaseUser = require('../models/firebaseUser.model.js');
var _this = this;

// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    /*if(!req.body.content) {
        return res.status(400).send({
            message: "Firebase User content can not be empty"
        });
    }*/
    // Create a firebaseUser
    const firebaseUser = new FirebaseUser({
        email: req.body.email,
        complete_name: req.body.complete_name,
        username: req.body.username,
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

exports.addLocation = (req,res) => {
    var location = { "latitude" : req.body.latitude, "longitude" : req.body.longitude };
    console.log("FIR UID:")
    console.log(req.body.userUID);
    console.log("A ADD LOCATION amb location");
    console.log(location)
    FirebaseUser.findOneAndUpdate(
        { _id: req.body.userUID },
        { $push: { locations: location  } },
        function (error, success) {
            if (error) {
                res.send(error);
            } else {
                res.send(success);
            }
        });
};

exports.findByName = (req,res) => {
    var data = req.params.searchname;
    FirebaseUser.find({'complete_name' : new RegExp(data, 'i')}, function(err, users){
        res.send(users)
    });
};



exports.getLastLocations = (req,res) => {
    getLastsLocations(function (x) {
        res.send(x);
    });
};



exports.nameByUID = (req,res) => {
    var uid = req.params.uid;
    var name = getNameByUID(uid, function(name){
        res.send(name);
    });
}

//MARK : Functions

function getNameByUID(uid,callback) {
    console.log("A getname");
    FirebaseUser.find({'firebase_uid' : uid}, 'complete_name', function (err, user) {
        console.log(user);
        callback(user);
    });
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