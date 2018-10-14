const Location = require('../models/location.model.js');

// Create and Save a new Location
exports.create = (req, res) => {
    // Create a location

    const location = new Location({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        firebase_uid: req.body.firebase_uid
    });

    // Save Location in the database
    location.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the location"
        });
    });
};

// Retrieve and return all Locations from the database.
exports.findAll = (req, res) => {
    Location.find()
        .then(locations => {
            res.send(locations);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving locations."
        });
    });
};

// Find a single Location with a LocationId
exports.findByUID = (req, res) => {
    Location.find({ firebase_uid: req.params.userUID })
        .then(userLocations => {
            if(!userLocations) {
                return res.status(404).send({
                    message: "Locations not found with id " + req.params.userUID
                });
            }
            res.send(userLocations);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Locations not found with id " + req.params.userUID
            });
        }
        return res.status(500).send({
            message: "Error retrieving Locations with id " + req.params.userUID
        });
    });
};

// Delete a Location with the specified LocationId in the request
exports.delete = (req, res) => {
    Location.findByIdAndRemove(req.params.userUID)
        .then(userLocations => {
            if(!userLocations) {
                return res.status(404).send({
                    message: "Loactions not found with id " + req.params.userUID
                });
            }
            res.send({message: "UserLocations deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "UserLocations not found with id " + req.params.userUID
            });
        }
        return res.status(500).send({
            message: "Could not delete UserLocations with id " + req.params.userUID
        });
    });
};