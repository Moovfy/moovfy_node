module.exports = (app) => {
    const Locations = require('../controllers/location.controller.js');

    // Create a new Location
    app.post('/locations/add', Locations.create);

    // Retrieve all Locations
    app.get('/locations', Locations.findAll);

    // Retrieve locations for the userUID
    app.get('/locations/:userUID', Locations.findByUID);

    // Delete locations with userUID
    app.delete('/users/:userUID', Locations.delete);
}